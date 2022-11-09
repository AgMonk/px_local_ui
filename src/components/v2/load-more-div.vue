<template>
  <div v-infinite-scroll="load"
       :infinite-scroll-disabled="loading || !hasNext"
       :infinite-scroll-distance="50"
       :style="{ 'min-height': minHeight+'px', 'max-height': maxHeight+'px', }"
       class="gin-scrollbar"
  >
    <!--    插槽 使用数据渲染-->
    <slot />

    <!--    到底标识-->
    <h3 v-if="!hasNext" style="color:white">到底了</h3>
    <div v-if="failed" style="color:white;cursor: pointer" @click="load">
      <h3>请求失败</h3>
      <h4>点击刷新</h4>
    </div>
    <div v-else-if="loading" v-loading="loading" style="min-height: 100px"></div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

const name = ""

export default {
  name: "load-more-div",
  emits: ["success", "failed"],
  data() {
    return {
      isInit: true,
      loading: false,
      failed: false,
      errorCount: 0,
    }
  },
  computed: {},
  methods: {
    //加载
    load() {
      this.request(this.params)
    },
    //请求
    request(params) {
      const method = this.isInit ? this.initRequest : this.loadMoreRequest;
      if (!method || !this.ready) {
        return
      }
      this.loading = true;
      method(params).then(res => {
        //判断是否还有更多内容
        this.loading = false;
        this.failed = false;
        //请求成功，抛出结果
        this.$emit("success", res, this.isInit)
        this.isInit = false;
      }).catch(e => {
        console.error(e)
        if (e.message.startsWith('timeout of ') && this.autoRetry && this.errorCount < this.maxError) {
          //当超时时、如果开启了自动重试、且次数没有超出限制,自动重试
          this.errorCount++;
          ElMessage.warning(`请求超时,3秒后自动重试,当前第 ${this.errorCount} 次`)
          setTimeout(() => {
            this.request(params)
          }, 3000)
        } else {
          //报错，抛出异常
          this.failed = true;
          this.loading = false;
          this.$emit("failed", e)
        }
      }).finally(() => {
      })
    },
  },
  mounted() {
  },
  watch: {
    initRequest() {
      this.isInit = true;
    },
    loadMoreRequest() {
      this.isInit = true;
    },
    params(params) {
      console.debug("参数变动", params)
      this.errorCount = 0;
    },
  },
  props: {
    //最小高度
    minHeight: {
      type: Number,
      default: 100,
    },
    //最大高度
    maxHeight: {
      type: Number,
      default: 500,
    },
    //初次请求方法
    initRequest: {
      type: Function,
      required: true,
    },
    //请求更多方法
    loadMoreRequest: {
      type: Function,
      required: true,
    },
    //参数
    params: {},
    //最大重试次数
    maxError: {
      type: Number,
      default: 5,
    },
    //是否准备好了
    ready: {
      type: Boolean,
      default: true,
    },
    //是否还有更多数据
    hasNext: {
      type: Boolean,
      default: true,
    },
    //自动重试
    autoRetry: {
      type: Boolean,
      default: true,
    },
  },
}

</script>

<style scoped>
</style>