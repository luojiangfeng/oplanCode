import {
  app,
  ipcMain,
  BrowserWindow,
  globalShortcut,
  dialog,
  shell
} from "electron"

//创建子进程,在子进程中启动本地node服务器
let child_process = require("child_process")
let exec = child_process.exec
let openExec

let ueseChildProcess = true

if (ueseChildProcess) {
  let server = require("../../server/app.js")
}

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\")
}

let mainWindow
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 670,
    frame: false,
    width: 1200,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      webSecurity: false
    }
  })

  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  if (ueseChildProcess) {
    //创建子进程，直接打开当前目录下的server.js
    openExec = exec("node ./server/app.js", function(error, stdout, stderr) {
      if (error) {
        console.log(error.stack)
        console.log("Error code: " + error.code)
        return
      }
      console.log("使用exec方法输出: " + stdout)
      console.log(`stderr: ${stderr}`)
      console.log(process.pid)
    })
  }
}

app.on("ready", createWindow)

if (ueseChildProcess) {
  // 当全部窗口关闭时退出。因为在electron关闭时，子进程一直存在，当下一次进入的时候，会提示端口占用，所以当应用窗口都关闭时，杀死node进程
  app.on("window-all-closed", () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== "darwin") {
      app.exit()
      // 判断openExec是否存在，存在就杀掉node进程
      if (!openExec) {
        // console.log('openExec is null')
      } else {
        exec("taskkill /f /t /im node.exe", function(error, stdout, stderr) {
          if (error) {
            console.log(error.stack)
            console.log("Error code: " + error.code)
            return
          }
          console.log("使用exec方法输出: " + stdout)
          console.log(`stderr: ${stderr}`)
        })
      }
    }
  })
}
/*================================= 通信 ===============================*/
//登录窗口最小化
ipcMain.on("min", function() {
  mainWindow.minimize()
})
//登录窗口最大化
ipcMain.on("max", function() {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
})
ipcMain.on("close", function() {
  mainWindow.close()
})

//键盘快捷键

// app.on("ready", () => {
//   globalShortcut.register("CommandOrControl+F1", () => {
//     shell.openItem("C:/Windows/system32/calc.exe") //打开指定程序
//   })
// })

ipcMain.on("openCalc", function() {
  shell.openItem("C:/Windows/system32/calc.exe") //始终置顶
})

ipcMain.on("windowfixTop", function() {
  mainWindow.setAlwaysOnTop(true) //始终置顶
})

ipcMain.on("windowUnFixTop", function() {
  mainWindow.setAlwaysOnTop(false) //解除始终置顶
})

//END 快捷键

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})
