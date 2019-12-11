export default {
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.$router.push({
      path: "/dayPlan/list"
    })

    // axios.get(`http://localhost:666/test`).then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  },
  computed: {},
  methods: {
    onNavbar(path) {
      this.$router.push({
        path
      })
    }
  }
}
