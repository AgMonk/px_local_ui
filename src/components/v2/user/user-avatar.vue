<template>
  <el-avatar :size="size" :src="src" />
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "user-avatar",
  data() {
    return {
      data: {},
      src: "",
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    load(uid) {
      this.data = this.getUser()(uid)
      if (!this.data) {
        this.src = ""
        return
      }
      if (this.data.avatarBig && this.big) {
        this.src = this.data.avatarBig;
      } else {
        this.src = this.data.avatar;
      }
    }
  },
  mounted() {
    this.load(this.uid)
  },
  watch: {
    uid(to) {

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