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
import {getFollowLatest} from "@/assets/js/request/follow-latest";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: "FollowLatest",
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
    setTitle("关注作品")
    getFollowLatest(1).then(res => {
      console.log(res)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>