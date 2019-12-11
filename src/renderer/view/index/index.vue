<template>
  <div :class="['page', clientWidth < 1200 ? 'collapse' : '']">
    <nav id="leftNav" class="left-nav">
      <el-menu
        default-active="1-1"
        :collapse="clientWidth < 1200 ? true : false"
        class="el-menu-vertical-demo"
        background-color="#282839"
        text-color="#a2a9b9"
        active-text-color="#fff"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-time"></i>
            <span>计划</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">日计划</el-menu-item>
            <el-menu-item disabled index="/Plan/edit">专项计划</el-menu-item>
            <el-menu-item disabled index="1-4">阶段计划</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item disabled index="/statistics">
          <!-- <el-menu-item index="/statistics"> -->
          <i class="iconfont icon-tongji" style="padding-right:12px;"></i>
          <span slot="title"> 数据统计</span>
        </el-menu-item>
        <!-- <el-menu-item index="/log">
          <i class="el-icon-star-off"></i>
          <span slot="title">常用网站</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">{{ useCustomTheme }}</span>
        </el-menu-item> -->
      </el-menu>

      <ul class="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </nav>
    <!-- <div class="clear"></div> -->

    <section class="main-content">
      <img
        v-show="bannerUrl != 'none' && bannerUrl"
        :src="bannerUrl"
        :class="['banner', bannerUrl != 'none' ? '' : 'theme-gradient']"
      />
      <div
        v-show="bannerUrl == 'none' || !bannerUrl"
        :class="['banner', bannerUrl != 'none' ? '' : 'theme-gradient']"
      ></div>
      <!-- <div class="cont-top">
       

      </div> -->
      <transition name="breadcrumb">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>

      <i
        title="快捷应用"
        @click="drawer = true"
        class="util-btn iconfont icon-applications"
      >
      </i>

      <el-drawer title="快捷应用" :visible.sync="drawer" custom-class="drawer">
        <el-row :gutter="12">
          <el-col :span="8">
            <div class="quick-entry" @click="openApply('calc')">
              <el-card shadow="hover">
                <i @click="" class="iconfont icon-jisuanqi"> </i>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-drawer>
    </section>

    <remote-css href="//at.alicdn.com/t/font_831663_4r6ypbfm1uc.css">
    </remote-css>
  </div>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
