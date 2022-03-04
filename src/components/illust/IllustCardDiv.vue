<template>
  <div>
    <div>
      <span><!--todo 时间跨度--></span>
      <el-button size="small" type="primary" @click="$emit('refresh')">刷新</el-button>
      <el-tag v-if="query.length>0" effect="dark" style="margin-left: 2px" type="primary">队列剩余：{{ query.length }}</el-tag>
    </div>
    <el-scrollbar height="651px">
      <illust-card v-for="pid in data" :pid="pid" @image-load="thread--;" />
    </el-scrollbar>
  </div>

</template>

<script>
import IllustCard from "@/components/illust/IllustCard";

export default {
  name: "IllustCardDiv",
  components: {IllustCard},
  emits: ['load-image', 'refresh'],
  data() {
    return {
      //显示的作品pid
      data: [],
      //待添加的pid
      query: [],
      //当前并行数量
      thread: 0,
      //加载卡片的最大并行数量
      maxThreads: 3,
      //自动加载
      internal: 0,
    }
  },
  computed: {},
  methods: {
    clear(array) {
      this.data = [];
      this.query = [];
      this.thread = 0;
      if (array) {
        this.addQuery(array)
      }
    },
    addQuery(array) {
      console.log(`添加作品卡队列 ${array.length} 个`)
      this.query.push(...array)
    },
  },
  mounted() {
    this.internal = setInterval(() => {
      if (this.query.length > 0 && this.thread < this.maxThreads) {
        const count = this.maxThreads - this.thread;
        this.data.push(...this.query.splice(0, count))
        this.thread += count;
        //报告队列剩余数量
        this.$emit('load-image', this.query.length)
      }
    }, 300)
  },
  unmounted() {
    clearInterval(this.internal)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>