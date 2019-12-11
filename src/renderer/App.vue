<template>
  <div id="app" v-show="initFinish">
    <vue-scroll>
      <top-fixed-nav style="-webkit-app-region: drag"></top-fixed-nav>
      <router-view></router-view>
      <theme-picker ref="themePicker" v-show="false" class="btn change-color">
      </theme-picker>
    </vue-scroll>
  </div>
</template>

<script>
import topFixedNav from "@/components/topFixedNav/topFixedNav.vue"
import themePicker from "@/components/themePicker"

export default {
  name: "oplan",
  data() {
    return {
      initFinish: false
    }
  },
  mounted() {
    this.$refs.themePicker.dbGetConfig(() => {
      this.initFinish = true
    })
  },
  components: { topFixedNav, themePicker }
}
</script>
<style lang="scss">
@import "./styles/common.scss";
</style>
