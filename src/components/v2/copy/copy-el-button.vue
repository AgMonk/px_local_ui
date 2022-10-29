<template>
  <el-button :size="size" :type="type" @click="click">
    <slot />
  </el-button>
</template>

<script>
import useClipboard from 'vue-clipboard3'
import {ElMessage} from "element-plus";

const {toClipboard} = useClipboard()
export default {
  name: "copy-el-button",
  data() {
    return {}
  },
  computed: {},
  methods: {
    async click() {
      try {
        await toClipboard(this.text)
        console.debug('已复制: ' + this.text)
        ElMessage.success('复制成功')
      } catch (e) {
        console.error(e)
      }
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    text: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
    onError: {
      type: Function,
    }
  },
}

</script>

<style scoped>

</style>