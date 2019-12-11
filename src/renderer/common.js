import Vue from "vue"
import { formatDate } from "@/utils.js"

Vue.prototype.$newObj = function(obj) {
  var newObj = JSON.parse(JSON.stringify(obj))
  return newObj
}

Vue.filter("formatDate", function(time, format) {
  time = time
  let date = new Date(time)
  return formatDate(date, format)
})
