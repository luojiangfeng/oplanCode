import CONFIG from "@/config"
import customTheme from "@/components/customTheme/customTheme.vue"

const { ipcRenderer: ipc } = require("electron")
const path = require("path")

export default {
  name: "topFixedNav",
  components: { customTheme },
  data() {
    return {
      bannerImg: "",
      winTop: false,
      themePopVisible: false,
      useCustomTheme: true
    }
  },
  methods: {
    winTopClick() {
      if (this.winTop) {
        console.log(1)
        ipc.send("windowUnFixTop")
      } else {
        console.log(2)
        ipc.send("windowfixTop")
      }
      this.winTop = !this.winTop
    },
    winOperation: function(type) {
      console.log(type)
      ipc.send(type)
    }
  }
}
