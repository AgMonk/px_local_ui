<template>
  <el-tooltip>
    <!--    todo 用户作品链接-->
    <!--    <router-link :to="`/user/${uid}/illust/1`">-->
    <el-link :type="type" :style="`font-size: ${size}px;`">
        {{ name }}
      </el-link>
    <!--    </router-link>-->
    <template #content>
      <el-link type="primary" :href="`https://www.pixiv.net/users/${uid}/artworks`" target="_blank">
        官方地址
      </el-link>
      <br>
      <my-copy-button :text="`https://www.pixiv.net/users/${uid}/artworks`">复制</my-copy-button>
    </template>
  </el-tooltip>
</template>

<script>
import {mapState} from "vuex";
import MyCopyButton from "@/components/common/my-copy-button";

export default {
  name: "UserLink",
  components: {MyCopyButton},
  data() {
    return {
      href: "",
      name: "",
    }
  },
  computed: {
    ...mapState("User", [`cache`]),
  },
  methods: {
    load(uid) {
      const key = `${uid}`
      if (this.cache.hasOwnProperty(key) && this.cache[key].name) {
        this.name = this.cache[key].name
      } else {
        this.name = '[未命名用户]';
      }
    }
  },
  mounted() {
    this.load(this.uid)
  },
  watch: {
    uid(to) {
      this.load(to)
    }
  },
  props: {
    uid: {
      type: Number,
      required: true,
    },
    size:{
      type:Number,
      default:15,
    },
    type:{
      type:String,
      default:'primary'
    }
  },
}

</script>

<style scoped>

</style>