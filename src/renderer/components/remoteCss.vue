
<script>
export default {
  render(createElement) {
    return createElement("link", {
      attrs: { rel: "stylesheet", href: this.href }
    });
  },
  props: {
    href: { type: String, required: true }
  }
};
</script>




