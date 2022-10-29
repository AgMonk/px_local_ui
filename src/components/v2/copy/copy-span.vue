<template>
  <span ref="copy-text" style="cursor: pointer" @click="click">{{ text }}</span>
</template>

<script>
import useClipboard from 'vue-clipboard3'
import {ElMessage} from "element-plus";

const {toClipboard} = useClipboard()
export default {
  name: "copy-span",
  data() {
    return {}
  },
  computed: {},
  methods: {
    async click() {
      try {
        await toClipboard(this.text + '')
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
    text: {},
    onError: {
      type: Function,
    }
  },
}

</script>

<style scoped>

</style>