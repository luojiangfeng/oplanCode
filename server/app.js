const http = require("http")
const url = require("url")
const fs = require("fs")
const path = require("path")
const formidable = require("formidable")

const hostname = "127.0.0.1"
const port = 7888

const ENV_PRODUCTION = process.env.NODE_ENV === "production" ? true : false

// let PUBLIC_DIR = path.resolve(__dirname, "./data/images/banner")
let PUBLIC_DIR = "./data/images/banner"

var checkDirExist = folderpath => {
  const pathArr = folderpath.split("/")
  let _path = ""
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i]) {
      if (pathArr[i] == ".") {
        _path += `${pathArr[i]}`
      } else {
        _path += `/${pathArr[i]}`
      }
      console.log(_path)
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)
      }
    }
  }
}

// 通过 createServer 创建 web服务器
const server = http.createServer((req, res) => {
  res.statusCode = 200
  // 设置返回的文本类型：纯文本text/plain
  res.setHeader("Content-Type", "application/json") //序列化后的 JSON 字符串
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", true)

  var pathname = url.parse(req.url).pathname //url请求路径

  if (pathname.substr(0, 5) == "/post") {
    var form = new formidable.IncomingForm()
    //设置编辑
    form.encoding = "utf-8"
    //设置文件存储路径
    form.uploadDir = PUBLIC_DIR
    //保留后缀
    form.keepExtensions = true
    //设置单文件大小限制
    form.maxFieldsSize = 2 * 1024 * 1024

    checkDirExist(PUBLIC_DIR)

    form.parse(req, function(err, fields, files) {
      console.log(files.bannerImg.path)
      console.log("文件名:" + files.bannerImg.name)
      var t = new Date().getTime()
      //生成随机数
      var ran = parseInt(Math.random() * 8999 + 10000)
      //拿到扩展名
      var extname = path.extname(files.bannerImg.name)

      var oldpath = path.normalize(files.bannerImg.path)
      //新的路径
      let newfilename = t + ran + extname
      var newpath = PUBLIC_DIR + "/" + newfilename
      console.warn("oldpath:" + oldpath + " newpath:" + newpath)
      fs.rename(oldpath, newpath, function(err) {
        if (err) {
          console.error("改名失败" + err)
        }

        let __path = newpath
        res.end(
          JSON.stringify({
            title: "文件上传成功:",
            data: {
              path: __path,
              name: newfilename
            }
          })
        )
      })

      //res.end(util.inspect({fields: fields, files: files}));
    })
  }

  //   var obj2 = {
  //     name: "撒大声地所",
  //     age: 232
  //   }
  //   res.end(JSON.stringify(obj2))
})

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n")
})

server.on("close", () => {
  console.log("server close")
})

server.on("connection", () => {
  console.log("server connection")
})

server.on("error", error => {
  console.log("server error,messmage is" + error)
})

server.listen(port, () => {
  console.log(`Server running at port:${port}`)
  console.log(`Server running at http://${hostname}:${port}/`)
})
