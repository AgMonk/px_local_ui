<template>
  <el-container v-loading="loading" direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color:white">作品数 ({{ files.images.length }})
      <router-link v-if="data.user" :to="{name:'fanbox创作者作品',params:{id:data.creatorId,page:1}}">
        <el-link type="success">
          {{ data.user.name }}
        </el-link>
      </router-link>
    </el-header>
    <el-main>
      <el-button type="success" @click="downloadImages">下载</el-button>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {findItem} from "@/assets/js/fanbox/request";
import {mapActions, mapState} from "vuex";
import {setTitle} from "@/assets/js/request/request";
import {getCache} from "@/assets/js/utils/StorageUtils";

export default {
  name: "FanboxItem",
  data() {
    return {
      loading: false,
      data: {},
      files: {
        images: [],
      }
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions("Aria2", ['startDownload']),
    mapToAria2Option(item, dir, index) {
      const {id, width, height, originalUrl, extension} = item
      index = index + ''
      const filename = `[${index.padStart(3, '0')}][${id}][${width}x${height}].${extension}`
      const urls = [originalUrl]
      const cookie = getCache('Fanbox_Cookie')
      const header = `cookie:${cookie}`
      return {
        urls, id, dir, filename, header
      }
    },
    load(route, force) {
      this.loading = true;
      const id = route.params.id;
      findItem(id).then(res => {
        console.log(res)
        this.data = res;
        const {id, body, user} = res
        if (body) {
          const imageMap = body.imageMap ? body.imageMap : body.images
          if (imageMap) {
            this.files.images = Object.keys(imageMap).map(i => imageMap[i]
            )
          }
        }
        this.loading = false;
      })
    },
    downloadImages() {
      const {userId, name} = this.data.user
      const {id, title} = this.data
      const dir = this.config.aria2.dir + `/[${userId}][${name}]/[${id}][${title}]`

      const array = []
      for (let i = 0; i < this.files.images.length; i++) {
        const item = this.files.images[i]
        array.push(this.mapToAria2Option(item, dir, i))
        this.startDownload(this.mapToAria2Option(item, dir, i))
      }
      console.log(array)
    },
  },
  mounted() {
    this.load(this.$route)
    setTitle("作品详情", "Fanbox")
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>