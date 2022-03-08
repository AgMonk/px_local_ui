<template>
  <el-container direction="vertical">
    <el-main>
      <el-form style="margin-left: 30px">
        <el-form-item>
          <template #label><span class="common-text">解析</span></template>
          <el-input v-model="value" class="home-input" />
          <el-button type="primary" @click="parse(value)">识别</el-button>
          <el-button type="primary" @click="parse(value,'pid')">pid</el-button>
          <el-button type="primary" @click="parse(value,'uid')">uid</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {getScreenInfo} from "@/assets/js/utils/ScreenUtils";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {value: ""}
  },
  methods: {
    getRoute(value, type) {
      const matchP = /artworks\/(\d+)/.exec(value)
      const matchU = /users\/(\d+)/.exec(value)
      if (!isNaN(value) && type) {
        if (type === 'pid') {
          return {name: '作品详情', params: {pid: Number(value)}}
        }
        if (type === 'uid') {
          return {name: '用户插画', params: {uid: Number(value), page: 1}}
        }
      } else if (matchP) {
        return {name: '作品详情', params: {pid: Number(matchP[1])}}
      } else if (matchU) {
        return {name: '用户插画', params: {uid: Number(matchU[1]), page: 1}}
      }
    },
    parse(value, type) {
      const route = this.getRoute(value, type)
      if (route) {
        this.$router.push(route)
      }
    }
  },
  mounted() {
    setTitle("首页")
    console.log(getScreenInfo())
  }
}
</script>

<style scoped>
.home-input {
  width: 300px
}
</style>