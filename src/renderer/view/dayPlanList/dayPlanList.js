let utils = require("@/utils.js");

export default {
  data() {
    return {
      tableData: [],
      pageData: {
        current: 1,
        total: 1,
        eachPage: 10
      },
      planListH: 500,
      showSearch: false,
      searchDate: "",
      searchKeywords: "",
      searchKeywordsWithTask: true,
      finishRange: [0, 100],
      gradeRange: [0, 5],
      queryObj: {},
      sortObj: {
        date: -1
      },
      db: this.$dbDayPlan
    };
  },
  mounted() {
    this.getDayPlanList();
  },
  computed: {},
  methods: {
    showLogDetail(time, cont, mood) {
      let date = new Date(time);
      let formatDateStr = utils.formatDate(date, "yyyy年MM月dd日");

      this.$alert(cont, formatDateStr, {
        dangerouslyUseHTMLString: true,
        closeOnPressEscape: true,
        customClass: "log-detail-pop"
      }).catch(() => {});
    },
    editDayPlan(id) {
      let that = this;

      this.$router.push({
        path: "/dayPlan/edit?id=" + id
      });
    },
    searchSubmit() {
      let that = this
      let _queryObj = {}
      //筛选 日期
      if (!that.searchDate) {
        delete _queryObj.date
      } else {
        _queryObj.date = {
          $gte: that.searchDate[0],
          $lte: that.searchDate[1]
        }
      }

      //筛选 完成度
      if (!that.finishRange) {
        delete _queryObj.totalTaskFinishRate
      } else {
        _queryObj.totalTaskFinishRate = {
          $gte: that.finishRange[0],
          $lte: that.finishRange[1]
        }
      }

      //筛选 满意度
      if (!that.gradeRange) {
        delete _queryObj.totalTaskGradeRate
      } else {
        _queryObj.totalTaskGradeRate = {
          $gte: that.gradeRange[0],
          $lte: that.gradeRange[1]
        }
      }

      //筛选 关键字
      if (!that.searchKeywords) {
        delete _queryObj.$or
      } else {

        _queryObj.$or = []
        _queryObj.$or[0] = {
          logContent: eval("/" + that.searchKeywords + "/")
        }

        if (that.searchKeywordsWithTask) {
          _queryObj.$or[1] = {
            amTaskArr: {
              $elemMatch: {
                taskTitle: eval("/" + that.searchKeywords + "/")
              }
            }
          }

          _queryObj.$or[2] = {
            pmTaskArr: {
              $elemMatch: {
                taskTitle: eval("/" + that.searchKeywords + "/")
              }
            }
          }

          _queryObj.$or[3] = {
            nightTaskArr: {
              $elemMatch: {
                taskTitle: eval("/" + that.searchKeywords + "/")
              }
            }
          }
        }
      }


      console.log(_queryObj)
      that.getDayPlanList(_queryObj)
    },
    tableSort(e) {
      console.log(e)
      if (e.prop == null) {
        return 0
      }

      let that = this
      let _type = e.prop
      let _order = e.order === "ascending" ? 1 : -1
      let sortObj = {}

      sortObj[_type] = _order
      that.sortObj = sortObj
      console.log(sortObj)
      that.getDayPlanList(that.queryObj, sortObj)
    },

    showSearchWrp() {
      this.showSearch = true
    },
    hideSearchWrp() {
      this.showSearch = false
    },
    /*================================= 数据 ===============================*/
    getDayPlanList(queryObj = {},
      sortObj = {
        date: -1
      }
    ) {
      let that = this;


      that.db.count({}, function (err, count) {
        that.pageData.total = count;
      });

      that.db
        .find(queryObj)
        .sort(sortObj)
        .skip((that.pageData.current - 1) * that.pageData.eachPage)
        .limit(that.pageData.eachPage)
        .exec(function (err, docs) {
          that.tableData = docs;
          that.queryObj = queryObj
          that.sortObj = sortObj

          that.$nextTick(function () {
            that.getListH();
          });
        });
    },
    getListH() {
      let topH = this.$refs.planList.offsetHeight;
      this.planListH = topH;
    },
    delDayPlan(id) {
      let that = this;
      that
        .$confirm("删除后不可恢复，确定吗？", "删除计划", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.db.remove({
              _id: id
            }, {},
            function (err, numReplaced) {
              that.db.persistence.compactDatafile();
              that.$message.success("删除成功！");
              that.getDayPlanList();
            }
          );
        })
        .catch(() => {});
    },
    handleCurrentChange(toPage) {
      let that = this
      let eachPage = that.pageData.eachPage
      let queryObj = that.queryObj
      let sortObj = that.sortObj

      that.db
        .find(queryObj)
        .sort(sortObj)
        .skip((that.pageData.current - 1) * eachPage)
        .limit(toPage * eachPage)
        .exec(function (err, docs) {
          that.tableData = docs;
        });
    }
  }
};