import themePicker from "@/components/themePicker"
import CONFIG from "@/config"
import { serverPathMid } from "@/utils"
import axios from "axios"
const path = require("path")

export default {
  components: { themePicker },
  data() {
    return {
      bannerImg: "",
      useCustomTheme: this.$store.state.config.theme.userCustomBanner,
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 10000000, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [8, 3], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      dialogVisible: false,
      picsList: [], //页面显示的数组
      loading: false
    }
  },

  mounted() {},
  computed: {
    customBannerPath() {
      return this.$store.state.config.theme.customBannerPath
    }
  },
  watch: {
    useCustomTheme(val, oldVal) {
      this.dbSaveUseCustomBanner(val)
    }
  },
  methods: {
    changeUpload(file, fileList) {
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = file.raw.path
        this.dialogVisible = true
      })
    },
    finish() {
      this.$refs.cropper.getCropData(data => {
        this.load = true
        // console.log(data)
        let resultFile = this.dataURLtoFile(data, "bannerImg.jpeg")

        this.uploadBanner(resultFile)
      })
    },
    uploadBanner(file) {
      // uploadBanner(event) {
      let that = this
      let thisFile = file
      var formdata = new FormData()
      formdata.append("bannerImg", thisFile)

      axios({
        method: "POST",
        url: CONFIG.SERVER + "/post/bannerImg",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(res => {
        let _path = res.data.data.path

        that.bannerImg = path.resolve(
          __dirname,
          serverPathMid(__dirname) + _path
        )

        that.dbSaveThemeBanner(_path, that.bannerImg)
      })
    },
    resetTheme() {
      this.useCustomTheme = false
      this.$refs.themePicker.theme = CONFIG.THEME.DEFAULT_COLOR
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },

    /*================================= 数据库 ===============================*/
    dbSaveThemeBanner(path, abPath) {
      let that = this
      let db = this.$dbConfig
      let doc = { bannerPath: path }

      db.count({}, function(err, count) {
        if (count > 1) {
          db.remove({}, { multi: true }, function(err, numRemoved) {})
        } else if (count === 1) {
          db.update(
            { _id: that.$dbConfig.data._id },
            { $set: { bannerPath: path } },
            { multi: true },
            function(err, numReplaced) {
              that.$store.commit("RESET_THEME", {
                customBannerPath: abPath
              })

              that.dialogVisible = false
              // that.$message.success("更新成功！")
            }
          )
        } else {
        }
      })
    },
    dbSaveUseCustomBanner(val) {
      let that = this
      let db = this.$dbConfig

      db.update(
        { _id: that.$dbConfig.data._id },
        { $set: { useCustomBanner: val } },
        { multi: true },
        function(err, numReplaced) {
          that.$store.commit("RESET_THEME", {
            userCustomBanner: that.useCustomTheme
          })

          // that.$message.success("更新成功！")
        }
      )
    }
  }
}
