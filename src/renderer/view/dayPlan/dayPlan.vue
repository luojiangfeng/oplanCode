<template>
  <section class="each-page">
    <section class="page-top">
      <ul class="page-top-nav">
        <li :class="$route.path == '/dayPlan/list' ? 'on' : ''">
          <router-link :to="{ path: 'list', query: { plan: 'private' } }">
            <i class="el-icon-tickets"></i>
            列表
          </router-link>
        </li>
        <li :class="$route.path == '/dayPlan/edit' ? 'on' : ''">
          <router-link :to="{ path: 'edit', query: { plan: 'private' } }">
            <i class="el-icon-setting"></i>
            编辑
          </router-link>
        </li>
      </ul>
    </section>

    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- </keep-alive> -->
  </section>
</template>

<script src="./dayPlan.js"></script>

<style src="./dayPlan.scss" lang="scss" scoped></style>
