// import E from "wangeditor"
let E = require("wangeditor")

function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ""
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }

  function padLeftZero(str) {
    return ("00" + str).substr(str.length)
  }

  return fmt
}

function editorInit(that, $ele, beforeCb, afterCb) {
  //edit富文本
  that.editor = new E($ele)
  let editor = that.editor
  // editor.customConfig.uploadImgShowBase64 = true
  editor.customConfig.zIndex = 100
  // editor.txt.html("<div>adasdsadasdsa</div>")
  editor.customConfig.menus = [
    "head",
    "justify",
    "emoticon",
    "bold",
    "foreColor",
    "backColor",
    "italic",
    "underline",
    "strikeThrough",
    "image",
    "video",
    "link"
  ]

  typeof beforeCb == "function" && beforeCb(editor)

  editor.create()

  typeof afterCb == "function" && afterCb(editor)
}

//根据环境和当前页面,计算相应的服务器图片的绝对地址
function serverPathMid(dir) {
  let result = ""
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV == "production") {
    result = "../../../../"
    return result
  } else {
    console.log(2)
    let dep = dir.split("\\").length
    for (let index = 0; index < dep; index++) {
      result += "../"
    }

    return result
  }
}

module.exports = {
  formatDate,
  editorInit,
  serverPathMid
}
