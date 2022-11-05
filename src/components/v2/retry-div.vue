<template>
  <div v-loading="loading" :style="{
    'min-height': minHeight+'px'
  }"
  >
    <div v-if="failed" :style="{
    'min-height': minHeight+'px'
  }" class="failed-div" @click="init"
    >
      <h3>请求失败</h3>
      <h4>点击刷新</h4>
    </div>
    <div v-else>
      <slot v-if="!unmountWhileLoading || !loading" />
    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "retry-div",
  emits: ["success", "failed"],
  data() {
    return {
      loading: true,
      failed: false,
      errorCount: 0,
    }
  },
  computed: {},
  methods: {
    init() {
      this.errorCount = 0;
      this.load(this.request, this.params)
    },
    //发送请求
    load(method, params) {
      if (!method) {
        return
      }
      if (!this.ready) {
        return;
      }
      this.loading = true;
      method(params).then(res => {
        this.loading = false;
        this.failed = false;
        this.$emit("success", res)
      }).catch(e => {
        console.error(e)

        if (e.message.startsWith('timeout of ') && this.autoRetry && this.errorCount < this.maxError) {
          //当超时时、如果开启了自动重试、且次数没有超出限制,自动重试
          this.errorCount++;
          ElMessage.warning(`请求超时,3秒后自动重试,当前第 ${this.errorCount} 次`)
          setTimeout(() => {
            this.load(method, params)
          }, 3000)
        } else {
          //报错，抛出异常
          this.failed = true;
          this.loading = false;
          this.$emit("failed", e)
        }
      }).finally(() => {
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    request(method) {

      console.debug("方法变动", method)
      this.errorCount = 0;
      this.load(method, this.params)
    },
    params(params) {
      console.debug("参数变动", params)
      this.errorCount = 0;
      this.load(this.request, params)
    },
  },
  props: {
    //请求方法
    request: {
      type: Function,
      required: true,
    },
    //参数
    params: {},
    //最小高度
    minHeight: {
      type: Number,
      default: 300,
    },
    //最大重试次数
    maxError: {
      type: Number,
      default: 5,
    },
    //加载时移除插槽
    unmountWhileLoading: {
      type: Boolean,
      default: false,
    },
    //加载时移除插槽
    ready: {
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
.failed-div {
  color: white;
  cursor: pointer;
}
</style>