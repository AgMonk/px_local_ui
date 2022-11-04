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
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "retry-div",
  emits: ["success", "failed"],
  data() {
    return {
      loading: true,
      failed: false,
    }
  },
  computed: {},
  methods: {
    init() {
      this.load(this.request, this.params)
    },
    //发送请求
    load(method, params) {
      if (!method) {
        return
      }
      this.loading = true;
      method(params).then(res => {
        this.failed = false;
        this.$emit("success", res)
      }).catch(e => {
        console.error(e)
        this.failed = true;
        this.$emit("failed", e)
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    request(method) {
      console.debug("方法变动", method)
      this.load(method, this.params)
    },
    params(params) {
      console.debug("参数变动", params)
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
    minHeight: {
      type: Number,
      default: 300,
    }
  },
}

</script>

<style scoped>
.failed-div {
  color: white;
  cursor: pointer;
}
</style>