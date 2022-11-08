<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color:white">{{ $route.name }}</el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

const name = "小说详情"

export default {
  name: "Novel",
  data() {
    return {
      nid: undefined,
    }
  },
  components: {},
  computed: {},
  methods: {
    ...mapActions("Novel", ['detail']),
    request(nid, force) {
      this.detail({nid, force})
    },
    load(route, force) {
      this.nid = Number(route.params.nid)
      this.request(this.nid, force);
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === name) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>