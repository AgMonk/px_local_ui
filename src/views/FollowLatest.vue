<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import {mapActions} from "vuex";

export default {
  name: "FollowLatest",
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapActions("FollowLatest", [`getFollowLatest`]),
  },
  mounted() {
    setTitle("关注作品")
    this.getFollowLatest({page: 1}).then(res => {
      console.log(res)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>