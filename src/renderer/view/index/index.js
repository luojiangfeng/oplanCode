import remoteCss from "@/components/remoteCss.vue"

let ipcRenderer = require("electron").ipcRenderer

export default {
  components: {
    remoteCss
  },
  data() {
    return {
      isCollapse: true,
      age: 0,
      number: 0,
      drawer: false,
      clientWidth: 1200
    }
  },
  computed: {
    useCustomTheme() {
      return this.$store.state.config.theme.userCustomBanner
    },
    customBannerPath() {
      return this.$store.state.config.theme.customBannerPath
    },
    bannerUrl() {
      if (this.useCustomTheme && this.customBannerPath) {
        return this.customBannerPath
      } else {
        return "none"
      }
    }
  },
  mounted() {
    let that = this

    ipcRenderer.on("main-process-event", (event, arg) => {
      that.$router.push({
        path: "/dayPlan/edit"
      })
    })

    //默认路由
    this.$router.push({
      path: "/dayPlan/list"
      // path: '/setting'
    })
    //根据视口宽度，折叠左侧导航
    this.clientWidth = document.documentElement.clientWidth
    window.onresize = function temp() {
      that.clientWidth = document.documentElement.clientWidth
    }
  },
  methods: {
    openApply(target) {
      ipcRenderer.send("openCalc")
    }
  }
}
