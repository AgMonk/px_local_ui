<template>
  <el-avatar :size="size" :src="big?data.avatarBig:data.avatar" />
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "user-avatar",
  data() {
    return {
      data: {},
      src: "",
      interval: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    load(uid) {
      this.data = this.getUser()(uid)
      if (!this.data) {
        this.interval = setInterval(() => {
          this.load(uid)
        }, 1000)
        return
      }
      clearInterval(this.interval);
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