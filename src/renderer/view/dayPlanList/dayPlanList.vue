<template>
  <section class="main-inner-cont" :style="{ height: planListH + 10 + 'px' }">
    <div class="page-handle">
      <div
        class="show-search-btn btn-opacity-white btn"
        v-show="!showSearch"
        @click="showSearchWrp"
      >
        <i class="el-icon-search"></i>搜索
      </div>
    </div>

    <section class="search-wrp" v-show="showSearch">
      <div class="each-line justify">
        <div class="date-wrp">
          <strong>日期:</strong>
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>

        <div class="keywords-wrp">
          <strong>关键字:</strong>
          <el-input
            v-model="searchKeywords"
            placeholder="请输入内容"
          ></el-input>

          <strong class="switch-title">含任务:</strong>
          <el-switch
            v-model="searchKeywordsWithTask"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>

        <div class="submit-wrp">
          <el-button type="primary" @click="searchSubmit" plain>查询</el-button>
        </div>
      </div>

      <div class="each-line ">
        <div class="finish-range-wrp">
          <strong>完成度:</strong>
          <el-slider v-model="finishRange" range show-stops :max="100">
          </el-slider>
        </div>

        <div class="gradeRange-range-wrp">
          <strong>满意度:</strong>
          <el-slider v-model="gradeRange" range show-stops :max="5">
          </el-slider>
        </div>
      </div>
      <em class="shink-btn" @click="hideSearchWrp"
        ><i class="el-icon-d-arrow-right"></i
      ></em>
    </section>
    <div class="table-wrp" ref="planList">
      <el-table
        :data="tableData"
        style="width: 100%"
        @sort-change="tableSort"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column label="日期" sortable="custom" width="125" prop="date">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{ scope.row.date | formatDate("yyyy-MM-dd") }}</span>
            <i
              :class="[
                'iconfont',
                'icon-aixin',
                'iconfont-mood',
                'type' + scope.row.mood
              ]"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="计划数" width="80">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              popper-class="el-popover-table-data"
            >
              <p
                v-if="
                  scope.row.amTaskArr &&
                    scope.row.pmTaskArr &&
                    scope.row.nightTaskArr
                "
              >
                {{
                  scope.row.amTaskArr.length > 0
                    ? "上午:" + scope.row.amTaskArr.length + "&nbsp&nbsp"
                    : ""
                }}
                {{
                  scope.row.pmTaskArr.length > 0
                    ? "下午:" + scope.row.pmTaskArr.length + "&nbsp&nbsp"
                    : ""
                }}
                {{
                  scope.row.nightTaskArr.length > 0
                    ? "晚上:" + scope.row.nightTaskArr.length + "&nbsp&nbsp"
                    : ""
                }}
              </p>
              <div slot="reference" class="popover-wrapper border">
                <el-tag size="medium">{{ scope.row.totalTaskNum }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="完成度"
          width="110"
          sortable="custom"
          prop="totalTaskFinishRate"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              popper-class="el-popover-table-data"
            >
              <p>
                {{
                  scope.row.amTaskFinishRate
                    ? "上午:" + scope.row.amTaskFinishRate + "&nbsp&nbsp"
                    : ""
                }}
                {{
                  scope.row.pmTaskFinishRate
                    ? "下午:" + scope.row.pmTaskFinishRate + "&nbsp&nbsp"
                    : ""
                }}
                {{
                  scope.row.nightTaskFinishRate
                    ? "晚上:" + scope.row.nightTaskFinishRate
                    : ""
                }}
              </p>
              <div
                slot="reference"
                :class="[
                  'popover-wrapper',
                  'normal',
                  scope.row.totalTaskFinishRate < 50 ? 'warn' : ''
                ]"
              >
                <el-tag size="medium" class="c-red"
                  >{{ scope.row.totalTaskFinishRate }}%</el-tag
                >
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="满意度"
          width="180"
          sortable="custom"
          prop="totalTaskGradeRate"
        >
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.totalTaskGradeRate"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="日志(备注)" >
          <template slot-scope="scope" v-if="scope.row.logContent">
            <div
              title="点击查看详情"
              class=" log-content"
              v-html="scope.row.logContent"
              @click="
                showLogDetail(
                  scope.row.date,
                  scope.row.logContent,
                  scope.row.mood
                )
              "
            ></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              circle
              @click="editDayPlan(scope.row._id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              circle
              @click="delDayPlan(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.current"
        :page-size="pageData.eachPage"
        layout="total, prev, pager, next, jumper"
        :total="pageData.total"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script src="./dayPlanList.js"></script>

<style src="./dayPlanList.scss" lang="scss" scoped></style>
