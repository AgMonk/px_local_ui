<template>
  <el-tooltip>
    <!--    todo 用户作品链接-->
    <!--    <router-link :to="`/user/${uid}/illust/1`">-->
    <el-link :style="`font-size: ${size}px;`" :type="type" :underline="false">
      {{ name }}
    </el-link>
    <!--    </router-link>-->
    <template #content>
      <el-link type="primary" :href="`https://www.pixiv.net/users/${uid}/artworks`" target="_blank">
        官方地址
      </el-link>
      <br>
      <my-copy-button :text="`https://www.pixiv.net/users/${uid}/artworks`">复制地址</my-copy-button>
      <my-copy-button :text="uid">复制UID</my-copy-button>
    </template>
  </el-tooltip>
</template>

<script>
import {mapGetters} from "vuex";
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
  },
  methods: {
    ...mapGetters("User", [`getUserFromCache`]),
    load(uid) {
      const user = this.getUserFromCache()(uid)
      if (user && user.name) {
        this.name = user.name
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