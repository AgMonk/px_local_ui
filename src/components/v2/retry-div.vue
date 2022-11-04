<template>
  <div v-loading="loading" :style="{
    'min-height': minHeight+'px'
  }"
  >
    <div v-if="failed" :style="{
    'min-height': minHeight+'px'
  }" class="failed-div" @click="load(request)"
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
    //发送请求
    load(method) {
      this.loading = true;
      method(this.force).then(res => {
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
    this.load(this.request)
  },
  watch: {
    request(method) {
      this.load(method)
    }
  },
  props: {
    //请求方法
    request: {
      type: Function,
      required: true,
    },
    //是否强制请求
    force: {
      type: Boolean,
    },
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