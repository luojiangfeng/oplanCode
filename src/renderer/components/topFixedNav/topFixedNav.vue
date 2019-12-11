<template>
  <nav class="top-fixed-nav theme-bg">
    <div class="inner">
      <h1></h1>
      <section class="right">
        <div class="userOpertion">
          <i
            title="设置"
            class="btn iconfont icon-pifu"
            @click="themePopVisible = true"
          >
          </i>

          <el-dialog title="设置皮肤" :visible.sync="themePopVisible">
            <custom-theme> </custom-theme>
            <!-- <div slot="footer" class="dialog-footer">
              <el-button @click="themePopVisible = false">取 消</el-button>
              <el-button type="primary" @click="themePopVisible = false"
                >确 定</el-button
              >
            </div> -->
          </el-dialog>

          <i title="设置" class="btn iconfont icon-shezhi" @click=""> </i>
        </div>
        <div class="winOperation">
          <i
            :style="{ 'font-size': '25px', color: winTop ? '#ffffff' : '' }"
            title="窗口置顶"
            class="btn iconfont icon-quxiaozhiding"
            @click="winTopClick"
          >
          </i>
          <i
            title="最小化"
            class="btn iconfont icon-zuixiaohua"
            @click="winOperation('min')"
          >
          </i>
          <i
            title="最大化"
            class="btn iconfont icon-zuidahua1"
            @click="winOperation('max')"
          >
          </i>
          <i
            title="关闭"
            class="btn iconfont icon-guanbi"
            @click="winOperation('close')"
          >
          </i>
        </div>
      </section>
    </div>
  </nav>
</template>

<script src="./topFixedNav.js"></script>

<style src="./topFixedNav.scss" lang="scss" scoped></style>
