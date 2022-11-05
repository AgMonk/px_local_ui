<template>
  <el-container direction="vertical" style="background-color: rgba(1,48,133,0.3)">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <div>
        <h2 style="color: white;text-align: left;">推荐作品</h2>
      </div>
      <!--      todo -->
      <load-more-div :init-request="test" :load-more-request="test" @failed="failed" @success="success">

        <ul style="color: white">
          <li v-for="item in data">{{ item }}</li>
        </ul>
      </load-more-div>
    </el-main>
  </el-container>

</template>

<script>
import LoadMoreDiv from "@/components/v2/load-more-div";
import {ElMessage} from "element-plus";

const name = ""

export default {
  name: "illust-recommend",
  components: {LoadMoreDiv},
  data() {
    return {
      data: [],
    }
  },
  computed: {},
  methods: {
    test() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999])
        }, 3000)
      })
    },
    //成功回调
    success(response, isInit) {
      console.log(isInit)
      this.data.push(...response)
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
  },
  mounted() {
  },
  watch: {
    pid(to) {
    }
  },
  props: {
    pid: {
      type: Number,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>