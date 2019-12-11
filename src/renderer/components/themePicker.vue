<template>
  <el-tooltip effect="dark" content="换肤" placement="bottom">
    <el-button>Top center</el-button>
    <el-color-picker
      v-model="theme"
      class="theme-picker"
      change="changeColor"
      size="small"
      :predefine="predefineColors"
      popper-class="theme-picker-dropdown"
    />
  </el-tooltip>
</template>

<script>
import CONFIG from "@/config"

export default {
  data() {
    return {
      chalk: "", // content of theme-chalk css
      theme: CONFIG.THEME.BASIC_COLOR,
      predefineColors: [
        "#191944",
        "#4a3594",
        "#C64E22",
        "#660C0C",
        "#B5604B",
        "#76D1D7",
        "#23326A",
        "#35839F",
        "#2E0436",
        "#282839"
      ]
    }
  },
  mounted() {
    this.dbGetConfig()
  },
  watch: {
    theme(val, oldVal) {
      this.changeThemeColor(val, oldVal)
    }
  },

  methods: {
    changeThemeColor(val, oldVal) {
      let that = this
      if (typeof val !== "string") return
      const themeCluster = this.getThemeCluster(val.replace("#", ""))
      const originalCluster = this.getThemeCluster(oldVal.replace("#", ""))

      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(
            CONFIG.THEME.BASIC_COLOR.replace("#", "")
          )
          const newStyle = this.updateStyle(
            this[variable],
            originalCluster,
            themeCluster
          )

          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement("style")
            styleTag.setAttribute("id", id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle

          that.dbSaveThemeColor(val, oldVal)
        }
      }

      const chalkHandler = getHandler("chalk", "chalk-style")

      if (!this.chalk) {
        const url = `styles.css`
        this.getCSSString(url, chalkHandler, "chalk")
      } else {
        chalkHandler()
      }
    },
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index])
      })
      return newStyle
    },

    getCSSString(url, callback, variable) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "")
          callback()
        }
      }
      xhr.open("GET", url)
      xhr.send()
    },

    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(",")
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    },

    changeColor() {},

    /*================================= 数据库 ===============================*/
    dbSaveThemeColor(color) {
      let that = this
      let db = this.$dbConfig
      let doc = { themeColor: color }

      db.count({}, function(err, count) {
        if (count > 1) {
          db.remove({}, { multi: true }, function(err, numRemoved) {})
        } else if (count === 1) {
          db.update(
            { _id: that.$dbConfig.data._id },
            { $set: { themeColor: color } },
            { multi: true },
            function(err, numReplaced) {
              // that.$message.success("更新成功！")
            }
          )
        } else {
          // db.insert(doc, function(err, newDoc) {
          //   that.$message.success("添加成功！")
          // })
        }
      })
    },
    dbGetConfig(cb) {
      let that = this
      let db = this.$dbConfig

      db.count({}, function(err, count) {
        if (count > 1) {
          db.remove({}, { multi: true }, function(err, numRemoved) {})
        } else if (count === 1) {
          db.findOne({}, function(err, docs) {
            that.theme = docs.themeColor
            typeof cb == "function" && cb()
          })
        } else {
          console.log(3)
          return
        }
      })
    }
  }
}
</script>

<style></style>
