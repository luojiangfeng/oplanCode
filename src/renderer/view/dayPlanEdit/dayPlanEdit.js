import {
  formatDate,
  editorInit
} from '@/utils.js'

let defaultTaskObj = {
  startTime: "",
  endTime: "",
  finishRate: 0,
  gradeRate: 3,
  taskTitle: ""
}

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

export default {
  data() {
    return {
      loading: false,
      formData: {
        logContent: "", //日志数据
        date: "", //日期
        mood: 1, //1=普通，2=开心，0=难受
        amTaskArr: [],
        pmTaskArr: [],
        nightTaskArr: []
      }
    }
  },
  mounted() {
    var that = this
    //获取ID
    if (this.$route.query.id) {
      console.log(this.$route.query.id)
      this.getDayPlan(this.$route.query.id)
    } else {
      //获取今日date
      let nowDate = formatDate(new Date(), 'yyyy/MM/dd')
      this.formData.date = new Date(nowDate)

      editorInit(that, '#editorElem', (editor) => {
        editor.customConfig.onchange = html => {
          that.formData.logContent = html
        }
      })
    }

  },
  computed: {
    moodTitle() {
      var _moodTitle = ""
      switch (this.formData.mood) {
        case 1:
          _moodTitle = "普通"
          break
        case 2:
          _moodTitle = "开心"
          break
        case 0:
          _moodTitle = "难受"
          break
      }

      return _moodTitle
    }
  },
  methods: {
    toggleMood() {
      if (this.formData.mood == 2) {
        this.formData.mood = 0
      } else {
        this.formData.mood++
      }
    },
    delTask(index, type) {
      this.$confirm("确定删除此计划吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let thisArr = this.formData[type + "TaskArr"]
          thisArr.splice(index, 1)
        })
        .catch(() => {})
    },
    orderUp(index, type) {
      if ((index = 0)) {
        return 0
      }

      let thisArr = this.formData[type + "TaskArr"]
      let temp = thisArr[index - 1]
      this.$set(thisArr, index - 1, thisArr[index])
      this.$set(thisArr, index, temp)
    },
    addTask(type) {
      console.log(type)
      let thisArr = this.formData[type + "TaskArr"]
      let _defaultTaskObj = this.$newObj(defaultTaskObj)

      if (thisArr.length > 0) {
        if (thisArr[thisArr.length - 1].endTime) {
          console.log('1111')
          _defaultTaskObj.startTime = thisArr[thisArr.length - 1].endTime
        }
      }
      thisArr.push(_defaultTaskObj)
    },

    pmAddTask() {
      let _defaultTaskObj = this.$newObj(defaultTaskObj)
      this.formData.amTaskArr.push(_defaultTaskObj)
    },
    nightAddTask() {
      let _defaultTaskObj = this.$newObj(defaultTaskObj)
      this.formData.amTaskArr.push(_defaultTaskObj)
    },
    emptyLog() {
      this.editor.txt.clear()
      this.formData.logContent = ''
    },
    resetStatus() {
      this.emptyLog()
      this.formData.mood = 1

      if (this.formData.amTaskArr.length > 0) {
        this.formData.amTaskArr.forEach(element => {
          element.finishRate = 0
          element.gradeRate = 3
        })
      }

      if (this.formData.pmTaskArr.length > 0) {
        this.formData.pmTaskArr.forEach(element => {
          element.finishRate = 0
          element.gradeRate = 3
        })
      }

      if (this.formData.nightTaskArr.length > 0) {
        this.formData.nightTaskArr.forEach(element => {
          element.finishRate = 0
          element.gradeRate = 3
        })
      }

    },
    /*================================= 数据 ===============================*/
    getDayPlan(id) {
      let that = this
      let db = this.$dbDayPlan

      db.findOne({
        _id: id
      }, function (err, docs) {
        that.formData = docs

        editorInit(that, '#editorElem', (editor) => {
          editor.customConfig.onchange = html => {
            that.formData.logContent = html
          }
        }, (editor) => {
          editor.txt.html(docs.logContent)
        })
      })
    },
    saveData() {
      let that = this
      let db = this.$dbDayPlan
      let doc = this.resetPostData(this.$data.formData)

      if (doc.length === 0) {
        this.$message.error('至少输入一项有效计划，或日志不为空！')
        return 0
      }

      console.log(doc)
      db.count({
          date: doc.date
        },
        function (err, count) {
          if (count > 0) {
            that
              .$confirm(formatDate(doc.date, 'yyyy年MM月dd日') + "的计划已存在，确认覆盖吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                db.update({
                    date: doc.date
                  },
                  doc, {},
                  function (err, numReplaced) {
                    db.persistence.compactDatafile()
                    that.$message.success('更新成功！')
                  }
                )
              })
              .catch(() => {})
          } else {
            delete doc._id
            db.insert(doc, function (err, newDoc) {
              that.$message.success('添加成功！')
            })
          }
        }
      )
    },

    /*================================= 其他 ===============================*/
    resetPostData(data) {
      var _amTaskArr = data.amTaskArr
      var _pmTaskArr = data.pmTaskArr
      var _nightTaskArr = data.nightTaskArr

      this.dropEmpty(_amTaskArr)
      this.dropEmpty(_pmTaskArr)
      this.dropEmpty(_nightTaskArr)

      data.totalTaskNum = _amTaskArr.length + _pmTaskArr.length + _nightTaskArr.length

      if (data.totalTaskNum === 0) {
        return []
      }

      // 完成度平均值
      data.amTaskFinishRate = this.getItemRate(_amTaskArr, "finishRate", 0)
      data.pmTaskFinishRate = this.getItemRate(_pmTaskArr, "finishRate", 0)
      data.nightTaskFinishRate = this.getItemRate(_nightTaskArr, "finishRate", 0)
      data.totalTaskFinishRate = Number(((data.amTaskFinishRate * _amTaskArr.length + data.pmTaskFinishRate * _pmTaskArr.length + data.nightTaskFinishRate * _nightTaskArr.length) / data.totalTaskNum).toFixed(0))

      // 满意度平均值
      data.amTaskGradeRate = this.getItemRate(_amTaskArr, "gradeRate")
      data.pmTaskGradeRate = this.getItemRate(_pmTaskArr, "gradeRate")
      data.nightTaskGradeRate = this.getItemRate(_nightTaskArr, "gradeRate")
      data.totalTaskGradeRate = Number(((data.amTaskGradeRate * _amTaskArr.length + data.pmTaskGradeRate * _pmTaskArr.length + data.nightTaskGradeRate * _nightTaskArr.length) / data.totalTaskNum).toFixed(2))

      for (let key in data) {
        if (data[key] === -1) {
          delete data[key]
        }
      }

      console.log(data)
      return data
    },
    getItemRate(rangeArr, item, fixedNum = 2) {
      let sum = 0
      if (rangeArr.length == 0) {
        return -1
      }

      for (let index = 0; index < rangeArr.length; index++) {
        const element = rangeArr[index]
        sum += element[item]
      }

      return Number((sum / (rangeArr.length)).toFixed(fixedNum))
    },
    dropEmpty(arr) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index]
        if (element.taskTitle.trim() == "") {
          arr.splice(index--, 1)
        }
      }

      return arr
    }
  }
}