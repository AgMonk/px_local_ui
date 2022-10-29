<template>
  <div v-if="failed" style="color: white;cursor: pointer" @click="refresh">
    <h3>请求失败</h3>
    <h4>点击刷新</h4>
  </div>
  <el-row v-else v-loading="loading" :style="{height:avatarSize+20+'px'}" class="user-title">
    <!--   作者头像-->
    <el-col v-if="!loading" :span="4">
      <user-avatar :size="avatarSize" :uid="uid" big />
    </el-col>
    <!--作者-->
    <el-col :span="20">
      <user-link :size="fontSize" :uid="uid" />
    </el-col>
  </el-row>
</template>

<script>

import UserLink from "@/components/v2/user/user-link";
import UserAvatar from "@/components/v2/user/user-avatar";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "user-title",
  components: {UserLink, UserAvatar},
  data() {
    return {
      failed: false,
      loading: false,

    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    ...mapActions("User", ['userInfo']),
    refresh() {
      this.load(this.uid, true)
    },
    load(uid, force) {
      this.data = this.getUser()(uid)
      if (!this.data || !this.data.avatarBig) {
        //发送请求
        this.loading = true;
        this.failed = false;
        this.userInfo({uid, force}).then(res => {
          console.log(res)
        }).catch(e => {
          console.error(e)
          this.failed = true;
        }).finally(() => {
          this.loading = false;
        })
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
    fontSize: {
      type: Number,
      default: 20,
    },
    avatarSize: {
      type: Number,
      default: 30,
    },
  },
}

</script>

<style scoped>
.user-title {
  text-align: left;
}
</style>