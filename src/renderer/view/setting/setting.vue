<template>
	<section class="each-page">
		<section class="main-inner-cont">
			<section class="each-section">

				<p class="section-title">换肤</p>
				<form class="form-horizontal" enctype='multipart/form-data' method='post' action='javascript:;'>
					<div class="form-group col-sm-6">
						<div class="col-sm-10">
							<input type="file" class="form-control" id="zhuboImg" name="zhuboImg">
							<el-button type="primary" @click="uploadSkin" size="small">上传</el-button>
						</div>
					</div>
				</form>
			</section>
			<section class="each-section">
				<p class="section-title">始终置顶</p>
				<el-button type="primary" plain @click="fixTop" size="small">置顶</el-button>
				<el-button type="primary" plain @click="unFixTop" size="small">解除</el-button>
			</section>
		</section>
	</section>
</template>

<script src = "./setting.js"></script>

<style src="./setting.scss" lang="scss" scoped></style>
