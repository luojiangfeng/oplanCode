import Vue from "vue"

import App from "./App"
import router from "./router"
import store from "./store"
import axios from "./axios"

import Element from "element-ui"
import vuescroll from "vuescroll"
import VueCropper from "vue-cropper"

import "element-ui/lib/theme-chalk/index.css"
import "./styles/mixinCss.scss"

import { initDB } from "@/db.js"
import common from "@/common.js"

if (!process.env.IS_WEB) Vue.use(require("vue-electron"))

Vue.use(Element)
Vue.use(VueCropper)

Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.use(vuescroll) // install the vuescroll first
Vue.prototype.$vuescrollConfig = {
  bar: {
    mode: "native",
    sizeStrategy: "number",
    showDelay: 500,
    onlyShowBarOnScroll: true,
    keepShow: false,
    background: "#2c2e32",
    opacity: 0.8,
    hoverStyle: false,
    specifyBorderRadius: false,
    minSize: false,
    size: "8px",
    disable: false
  }
}

initDB(() => {
  new Vue({
    components: {
      App
    },
    router,
    store,
    template: "<App/>"
  }).$mount("#app")
})
