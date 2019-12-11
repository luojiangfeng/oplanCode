<template>
  <div class="">
    <el-form label-position="right" label-width="120px">
      <el-form-item label="主题色：">
        <theme-picker ref="themePicker" class="btn change-color" title="换肤">
        </theme-picker>
        <el-button size="mini" plain round class="reset-btn" @click="resetTheme"
          >恢复默认</el-button
        >
      </el-form-item>
      <el-form-item label="自定义图片：">
        <el-switch v-model="useCustomTheme"> </el-switch>
      </el-form-item>
      <el-form-item label="" v-show="useCustomTheme">
        <el-upload
          class="banner-uploader"
          :auto-upload="false"
          :on-change="changeUpload"
          drag
          action="/post/bannerImg"
          :http-request="uploadBanner"
          :show-file-list="false"
        >
          <i v-show="!customBannerPath" class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <img
            class="upload-banner-img"
            v-if="customBannerPath"
            :src="customBannerPath"
          />
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script src="./customTheme.js"></script>

<style src="./customTheme.scss" lang="scss" scoped></style>
