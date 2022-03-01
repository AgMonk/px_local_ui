<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <el-container>
        <el-main id="预览图片">

        </el-main>
        <el-aside id="信息">
          <div id="作者信息">

          </div>
          <div id="作品信息">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="pid">
                <my-copy-button :text="data.id">{{ data.id }}</my-copy-button>
                <my-copy-button :text="`https://www.pixiv.net/artworks/${data.id}`">地址</my-copy-button>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间" v-if="data.timestamp">{{data.timestamp.create}}</el-descriptions-item>
              <el-descriptions-item label="上传时间" v-if="data.timestamp&& data.timestamp.create!==data.timestamp.upload">{{data.timestamp.upload}}</el-descriptions-item>
              <el-descriptions-item label="尺寸">{{ data.width }}x{{ data.height }}</el-descriptions-item>
              <el-descriptions-item label="喜欢" v-if="data.counts">{{data.counts.like}}</el-descriptions-item>
              <el-descriptions-item label="浏览" v-if="data.counts">{{data.counts.view}}</el-descriptions-item>
              <el-descriptions-item label="收藏" v-if="data.counts">{{data.counts.bookmark}}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-aside>
      </el-container>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";
import MyCopyButton from "@/components/common/my-copy-button";

export default {
  name: "ArtworkDetail",
  components: {MyCopyButton},

  data() {
    return {
      data: {},
    }
  },
  computed: {},
  methods: {
    ...mapActions("Artworks", [`getIllustInfo`]),

  },
  mounted() {
    const pid = Number(this.$route.params.pid)
    this.getIllustInfo({pid}).then(res => {
      console.log(res)
      this.data = res
    }).catch(reason => {
      console.log(reason)
      const {message, status,} = reason
      ElMessage.error(`${status}: ${message}`)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>