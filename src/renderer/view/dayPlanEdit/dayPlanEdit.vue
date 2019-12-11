<template>
	<section class="main-inner-cont" v-loading="loading">
		<div class="page-handle">
			<div class="show-search-btn btn-opacity-white btn" @click="resetStatus">
				<i class="el-icon-refresh"></i>重置状态
			</div>
		</div>

		<div class="edit-top">
			<span>日期：</span>
			<el-date-picker v-model="formData.date" type="date" placeholder="选择日期">
			</el-date-picker>

			<div class="mood-wrp">
				<span>心情颜色：</span>
				<i @click="toggleMood" :class="['iconfont', 'icon-aixin', 'iconfont-mood' ,'type'+formData.mood]"></i>
			</div>
		</div>
		<div class="task-wrp">
			<el-row class="thead" type="flex">
				<el-col :xs="12" :sm="12">
					<div class="table-title">上午
						<i class="el-icon-circle-plus btn-add" @click="addTask('am')"></i>
					</div>
					<article class="each-task-list">
						<div class="each-task" v-for="(item,index) in formData.amTaskArr">
							<div class="order">
								<i v-if="index!=0" class="el-icon-caret-top btn-top" @click="orderUp(index,'am')"></i>
								<strong class="order-num">{{index+1}}</strong>
								<i class="el-icon-remove btn-bttm" @click="delTask(index,'am')"></i>
							</div>
							<div class="time-wrp">
								<el-time-select placeholder="star" v-model="item.startTime" :picker-options="{
      start: '06:00',
      step: '00:05',
      end: '13:00'
    }">
								</el-time-select>
								<el-time-select placeholder="end" v-model="item.endTime" :picker-options="{
      start: '06:00',
      step: '00:05',
      end: '13:00',
      minTime: item.startTime
    }">
								</el-time-select>
							</div>
							<div class="title col1">

								<el-input type="textarea" :rows="3" placeholder="请输入计划内容" v-model="item.taskTitle">
								</el-input>
							</div>
							<div class="option col2">
								<div class="each-option">
									<strong>完成:</strong>
									<el-slider v-model="item.finishRate" :step="10">
									</el-slider>
								</div>
								<div class="each-option">
									<strong>评分:</strong>
									<el-rate v-model="item.gradeRate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
									</el-rate>
								</div>
							</div>
						</div>
					</article>
				</el-col>
				<!-- 下午 -->
				<el-col :xs="12" :sm="12">
					<div class="table-title">下午
						<i class="el-icon-circle-plus btn-add" @click="addTask('pm')"></i>
					</div>
					<article class="each-task-list">
						<div class="each-task" v-for="(item,index) in formData.pmTaskArr">
							<div class="order">
								<i v-if="index!=0" class="el-icon-caret-top btn-top" @click="orderUp(index,'am')"></i>
								<strong class="order-num">{{index+1}}</strong>
								<i class="el-icon-remove btn-del" @click="delTask(index,'pm')"></i>
							</div>
							<div class="time-wrp">
								<el-time-select placeholder="star" v-model="item.startTime" :picker-options="{
      start: '12:00',
      step: '00:05',
      end: '20:00'
    }">
								</el-time-select>
								<el-time-select placeholder="end" v-model="item.endTime" :picker-options="{
      start: '12:00',
      step: '00:05',
      end: '20:00',
      minTime: item.startTime
    }">
								</el-time-select>
							</div>
							<div class="title col1">

								<el-input type="textarea" :rows="3" placeholder="请输入计划内容" v-model="item.taskTitle">
								</el-input>
							</div>
							<div class="option col2">
								<div class="each-option">
									<strong>完成:</strong>
									<el-slider v-model="item.finishRate" :step="10">
									</el-slider>
								</div>
								<div class="each-option">
									<strong>评分:</strong>
									<el-rate v-model="item.gradeRate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
									</el-rate>
								</div>
							</div>
						</div>
					</article>
				</el-col>
			</el-row>
			<!-- 晚上 -->
			<el-row class="thead" type="flex">
				<el-col :xs="12" :sm="12">
					<div class="table-title">晚上
						<i class="el-icon-circle-plus btn-add" @click="addTask('night')"></i>
					</div>
					<article class="each-task-list">
						<div class="each-task" v-for="(item,index) in formData.nightTaskArr">
							<div class="order">
								<i v-if="index!=0" class="el-icon-caret-top btn-top" @click="orderUp(index,'am')"></i>
								<strong class="order-num">{{index+1}}</strong>
								<i class="el-icon-remove btn-del" @click="delTask(index,'night')"></i>
							</div>
							<div class="time-wrp">
								<el-time-select placeholder="star" v-model="item.startTime" :picker-options="{
      start: '18:00',
      step: '00:05',
      end: '26:00'
    }">
								</el-time-select>
								<el-time-select placeholder="end" v-model="item.endTime" :picker-options="{
      start: '18:00',
      step: '00:05',
      end: '26:00',
      minTime: item.startTime
    }">
								</el-time-select>
							</div>
							<div class="title col1">

								<el-input type="textarea" :rows="3" placeholder="请输入计划内容" v-model="item.taskTitle">
								</el-input>
							</div>
							<div class="option col2">
								<div class="each-option">
									<strong>完成:</strong>
									<el-slider v-model="item.finishRate" :step="10">
									</el-slider>
								</div>
								<div class="each-option">
									<strong>评分:</strong>
									<el-rate v-model="item.gradeRate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
									</el-rate>
								</div>
							</div>
						</div>
					</article>
				</el-col>
				<!-- 下午 -->
				<el-col :xs="12" :sm="12" class="log">
					<div class="table-title">日志(备注)
						<i class="el-icon-delete btn-add" @click="emptyLog"></i>
					</div>
					<article class="each-task-list">
						<div id="editorElem" class="editor-modul"></div>
					</article>
				</el-col>
			</el-row>
		</div>

		<div class="handle-wrp">
			<el-button type="primary" @click="saveData">保存</el-button>
		</div>
		<!-- <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=25706282&auto=1&height=66"></iframe> -->
	</section>
</template>

<script src = "./dayPlanEdit.js"></script>
<style src="./dayPlanEdit.scss" lang="scss" scoped></style>

