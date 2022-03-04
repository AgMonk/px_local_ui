<template>
  <div>
    <div>
      <el-button v-if="!disableRefresh" size="small" type="primary" @click="$emit('refresh')">刷新</el-button>
      <span v-if="showDateRange && maxDate" class="common-text" style="margin-left: 2px">
        <el-tag effect="dark">{{ maxDate }}</el-tag>
        ~
        <el-tag effect="dark">{{ minDate }}</el-tag>
      </span>
      <el-tag v-if="query.length>0" effect="dark" style="margin-left: 2px">队列：{{ query.length }}</el-tag>

    </div>
    <el-scrollbar :height="`${height}px`">
      <illust-card v-for="pid in data" :pid="pid" @image-load="thread--;" />
    </el-scrollbar>
  </div>

</template>

<script>
import IllustCard from "@/components/illust/IllustCard";
import {mapGetters} from "vuex";

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
      maxThreads: 2,
      //自动加载
      internal: 0,
      maxDate: "",
      minDate: "",
    }
  },
  computed: {
  },
  methods: {
    ...mapGetters("Artworks", [`getIllustFromCache`]),
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

      //  获取时间跨度
      const max = Math.max(...this.data, ...this.query)
      const min = Math.min(...this.data, ...this.query)
      this.maxDate = this.getIllustFromCache()(max).timestamp.create.substring(5, 16)
      this.minDate = this.getIllustFromCache()(min).timestamp.create.substring(5, 16)
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
  props: {
    showDateRange: {type: Boolean, default: true},
    height: {type: Number, default: 651},
    disableRefresh: {type: Boolean, default: false},
  },
}

</script>

<style scoped>

</style>