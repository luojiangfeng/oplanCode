let ipcRenderer = require("electron").ipcRenderer

export default {
  data() {
    return {
      uploadBannerImg: "",
      testData: "2"
    }
  },
  created() {},
  mounted() {
    let that = this
    // axios.get(`http://localhost:666/test`).then(function (response) {
    //     that.testData = response.testD
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  },
  computed: {},
  methods: {
    uploadSkin() {
      // let file = document.getElementById("zhuboImg").files[0];
      // let formData = new FormData();
      // formData.append("zhuboImg", file);
      // axios.post(`http://localhost:666/upload/zhuboImg?pinYin=1001`, formData).then(function (response) {
      //     console.log(response)
      //     console.log('3333')
      //     if (response.filePath) {
      //       that.uploadBannerImg = response.filePath
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    },

    fixTop() {
      ipcRenderer.send("windowfixTop")
    },
    unFixTop() {
      ipcRenderer.send("windowUnFixTop")
    }
  }
}
