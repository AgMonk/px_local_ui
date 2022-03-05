<template>
  <el-tooltip :disabled="disabledTooltip" effect="light" placement="top">
    <router-link :to="{name:'作品详情',params:{pid},query:{from:$route.fullPath}}">
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
      <el-button size="small" type="primary" @click="addTitleFilter">添加屏蔽</el-button>
    </template>
  </el-tooltip>

</template>

<script>
import MyCopyButton from "@/components/common/my-copy-button";
import {mapGetters, mapMutations} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "IllustLink",
  components: {MyCopyButton},
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapGetters("Artworks", [`getIllustFromCache`]),
    ...mapMutations('Config', [`addFilter`]),
    addTitleFilter() {
      const illust = this.getIllustFromCache()(this.pid)
      ElMessageBox.prompt('关键字', '添加标题关键字屏蔽', {
        inputValue: illust ? illust.title : '',
      }).then(res => {
        this.addFilter({key: 'title', value: res.value})
      }).catch(reason => {
        console.log(reason)
        ElMessage.info("已取消")
      })
    },
  },
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