<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main style="text-align: left">
      <illust-card v-for="pid in pidShow" :pid="pid" @image-load="move" />
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import {mapActions} from "vuex";
import IllustCard from "@/components/illust/IllustCard";

export default {
  name: "FollowLatest",
  components: {IllustCard},
  data() {
    return {
      pidShow: [],
      pidList: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("FollowLatest", [`getFollowLatest`]),
    move() {
      // console.log(e)
      if (this.pidList.length > 0) {
        this.pidShow.push(...this.pidList.splice(0, 1))
      }
    }
  },
  mounted() {
    setTitle("关注作品")
    this.getFollowLatest({page: 1}).then(res => {
      this.pidList.push(...res)
      this.move()
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>