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
      <span v-if="data" style="margin-left: 10px">
        <el-button v-if="data.isFollowed" :disabled="unfollowing" size="small" type="info" @click="unfollow">
          <el-icon v-if="unfollowing" class="is-loading" color="blue">
            <Loading />
          </el-icon>
          <span v-else>已关注</span>
        </el-button>
        <el-button v-else :disabled="following" size="small" type="success" @click="follow">
          <el-icon v-if="following" class="is-loading" color="blue">
            <Loading />
          </el-icon>
          <span v-else>关注</span>
        </el-button>
      </span>
    </el-col>
  </el-row>
</template>

<script>

import UserLink from "@/components/v2/user/user-link";
import UserAvatar from "@/components/v2/user/user-avatar";
import {mapActions, mapGetters} from "vuex";
import {ElMessage} from "element-plus";
import {Loading} from "@element-plus/icons-vue";

export default {
  name: "user-title",
  components: {UserLink, UserAvatar, Loading},
  data() {
    return {
      failed: false,
      loading: false,
      data: undefined,
      unfollowing: false,
      following: false,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    ...mapActions("User", ['userInfo']),
    refresh() {
      this.load(this.uid, true)
    },
    follow() {
      this.following = true;
      this.$store.getters.getApi.follow.add(this.uid, 0, '').then(() => {
        this.data.isFollowed = true
      }).catch(e => {
        console.error(e)
        ElMessage.error("关注失败,请重试")
      }).finally(() => {
        this.following = false;
      })
    },
    unfollow() {
      this.unfollowing = true;
      this.$store.getters.getApi.follow.del(this.uid).then(() => {
        this.data.isFollowed = false
      }).catch(e => {
        console.error(e)
        ElMessage.error("取关失败,请重试")
      }).finally(() => {
        this.unfollowing = false;
      })
    },
    load(uid, force) {
      this.data = this.getUser()(uid)
      if (!this.data || !this.data.avatarBig) {
        //发送请求
        this.loading = true;
        this.failed = false;
        this.userInfo({uid, force}).then(res => {
          console.log(res)
          this.data = res;
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