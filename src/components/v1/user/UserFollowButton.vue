<template>
  <el-button v-if="isFollowed && isNotSelf(user)" :disabled="loading" :size="size" type="info" @click="doUnFollow">
    <span v-if="loading">正在取消</span>
    <span v-else>已关注</span>
  </el-button>
  <el-button v-else-if="isNotSelf(user)" :disabled="loading" :size="size" type="success" @click="doFollow">
    <span v-if="loading">正在关注</span>
    <span v-else>关注</span>
  </el-button>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "UserFollowButton",
  data() {
    return {
      loading: false,
      isFollowed: false,
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions("User", [`follow`, `unfollow`]),
    isNotSelf(user) {
      return user.id !== this.config.uid
    },
    doFollow() {
      this.loading = true;
      this.follow({uid: this.user.id, token: this.config.token}).then(() => {
        ElMessage.success("关注成功")
        this.loading = false
        this.isFollowed = true
      })
    },
    doUnFollow() {
      this.loading = true;
      this.unfollow({uid: this.user.id, token: this.config.token}).then(() => {
        ElMessage.success("已取消关注")
        this.loading = false
        this.isFollowed = false
      })
    },
  },
  mounted() {
    this.isFollowed = this.user.isFollowed
  },
  watch: {
    user(to) {
      this.isFollowed = to.isFollowed
    }
  },
  props: {
    user: {type: Object, required: true},
    size: {
      type: String,
      default: "small",
    },
  },
}

</script>

<style scoped>

</style>