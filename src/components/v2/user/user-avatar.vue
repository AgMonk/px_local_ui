<template>
  <el-avatar v-if="data" :size="size" :src="src"/>
</template>

<script>
import {mapGetters} from "vuex";
import {IMG_URL_PREFIX} from "@/assets/v2/domain"

export default {
  name: "user-avatar",
  data() {
    return {
      data: undefined,
      src: "",
      interval: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    setInterval(uid) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.load(uid)
      }, 1000)
    },
    load(uid) {
      this.data = this.getUser()(uid)
      if (this.data) {
        const {avatar, avatarBig} = this.data;
        let url = (this.big && avatarBig) ? avatarBig : avatar;
        if (url) {
          this.src = url.replace('https://i.pximg.net', IMG_URL_PREFIX)
          clearInterval(this.interval);
        } else {
          this.setInterval(uid)
        }
      } else {
        this.setInterval(uid)
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
    size: {
      default: 20,
    },
    big: {
      type: Boolean,
      default: false,
    }
  },
}

</script>

<style scoped>

</style>