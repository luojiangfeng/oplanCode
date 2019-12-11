/**
 * Created by xushaoping on 17/9/12.
 */
import Vue from "vue"
import Datastore from "nedb"
import store from "./store"
import CONFIG from "@/config"
import { serverPathMid } from "@/utils"

const path = require("path")

// 日计划
const dbDayPlan = new Datastore({
  autoload: true,
  filename: "./data/db/dbDayPlan.db"
})

const dbArticle = new Datastore({
  autoload: true,
  filename: "./data/db/dbArticle.db"
})

const dbConfig = new Datastore({
  autoload: true,
  filename: "./data/db/dbConfig.db"
})

Vue.prototype.$dbDayPlan = dbDayPlan
Vue.prototype.$dbArticle = dbArticle
Vue.prototype.$dbConfig = dbConfig

/*================================= 初始化 ===============================*/
const DB_INIT_DATA = {
  themeColor: CONFIG.THEME.DEFAULT_COLOR,
  bannerPath: CONFIG.THEME.DEFAULT_BANNER,
  useCustomBanner: CONFIG.THEME.BANNER_CUSTOM
}

export function initDB(cb) {
  //初始化配置数据库
  let db = dbConfig

  db.count({}, function(err, count) {
    if (count === 0) {
      db.insert(DB_INIT_DATA, function(err, newDoc) {
        Vue.prototype.$dbConfig.data = newDoc
        initStore(newDoc)
        typeof cb == "function" && cb()
      })
    } else if (count === 1) {
      db.findOne({}, function(err, docs) {
        Vue.prototype.$dbConfig.data = docs
        initStore(docs)
        typeof cb == "function" && cb()
      })
    } else {
      return
    }
  })
}

function initStore(data) {
  let bannerAbPath
  if (!data.bannerPath) {
    bannerAbPath = undefined
  } else {
    bannerAbPath = path.resolve(
      __dirname,
      serverPathMid(__dirname) + data.bannerPath
    )
  }

  store.commit("RESET_THEME", {
    customBannerPath: bannerAbPath,
    userCustomBanner: data.useCustomBanner
  })
}
