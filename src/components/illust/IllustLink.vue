<template>
  <el-tooltip :disabled="disabledTooltip" effect="light" placement="top">
    <router-link :to="{name:'作品详情',params:{pid}}">
      <el-link :style="`font-size: ${size}px;`" :type="type" :underline="false">
        <slot />
      </el-link>
    </router-link>
    <template #content>
      <el-link :href="`https://www.pixiv.net/artworks/${pid}`" target="_blank" type="primary">
        官方地址
      </el-link>
      <br>
      <my-copy-button :text="`https://www.pixiv.net/artworks/${pid}`">复制</my-copy-button>
    </template>
  </el-tooltip>

</template>

<script>
import MyCopyButton from "@/components/common/my-copy-button";

export default {
  name: "IllustLink",
  components: {MyCopyButton},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    pid: {type: Number, required: true},
    type: {type: String, default: 'primary'},
    // text: {type: String, required:true},
    size: {
      type: Number, default: 15,
    },
    disabledTooltip: {type: Boolean, default: false},
  },
}

</script>

<style scoped>

</style>