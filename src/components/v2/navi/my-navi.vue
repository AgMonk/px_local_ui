<template>
  <el-menu
      :active-text-color="activeTextColor"
      :background-color="backgroundColor"
      :default-active.sync="activeIndex"
      :text-color="textColor"
      mode="horizontal"
      router
      @select="select"
  >
    <my-navi-item v-for="(item,key) in routes" :key="key+''" :route="item" />
  </el-menu>
</template>

<script>
import MyNaviItem from "@/components/v2/navi/my-navi-item";

export default {
  name: "my-navi",
  components: {MyNaviItem},
  data() {
    return {
      activeIndex: "",
    }
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    routes: {
      type: Array
    },
    select: {
      type: Function,
    },
    activeTextColor: {
      default: "#ffd04b"
    },
    backgroundColor: {
      default: "#545c64"
    },
    textColor: {
      default: "#fff"
    },

  },
}

</script>

<style scoped>

</style>