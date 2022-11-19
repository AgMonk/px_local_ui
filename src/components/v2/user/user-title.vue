<template>
  <retry-div :min-height="110" :params="params" :request="request" @failed="failed" @success="success">
    <div :style="{height:avatarSize+20+'px'}" class="user-title"><!--   作者头像-->
      <span>
        <user-avatar :size="avatarSize" :uid="uid" big />
      </span>
                                                                 <!--作者-->
      <span>
        <user-link :size="fontSize" :uid="uid" />
        <span v-if="data && !disableFollowButton" style="margin-left: 10px">
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
      </span>
    </div>
    <!--    社交媒体-->
    <div v-if="data&&data.social&&Object.keys(data.social).length>0">
      <el-form>
        <el-form-item>
          <template #label>
            <span style="color:white">社交媒体</span>
          </template>
          <el-link v-for="({url},label) in data.social" :href="url" class="social-link" target="_blank" type="success">{{ label }}</el-link>

        </el-form-item>
      </el-form>
    </div>
  </retry-div>
</template>

<script>

import UserLink from "@/components/v2/user/user-link";
import UserAvatar from "@/components/v2/user/user-avatar";
import {mapActions, mapGetters} from "vuex";
import {ElMessage} from "element-plus";
import {Loading} from "@element-plus/icons-vue";
import RetryDiv from "@/components/v2/retry-div";

export default {
  name: "user-title",
  components: {RetryDiv, UserLink, UserAvatar, Loading},
  data() {
    return {
      data: undefined,
      unfollowing: false,
      following: false,
      params: {
        uid: this.uid,
        force: false,
      }
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    ...mapActions("User", ['userInfo']),
    //刷新请求
    refresh() {
      this.$refs.cardGroup.clear([])
      this.load(this.uid, true)
    },
    //请求
    request(params) {
      return this.userInfo(params)
    },
    //成功回调
    success(res) {
      this.data = res;
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    //加载方法
    load(uid, force) {
      this.data = this.getUser()(uid)
      if (!this.data || !this.data.avatarBig) {
        this.params = {uid, force}
      }
    },
    follow() {
      this.following = true;
      this.$store.getters.getApi.userApi.follow(this.uid, 0, '').then(() => {
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
      this.$store.getters.getApi.userApi.unfollow(this.uid).then(() => {
        this.data.isFollowed = false
      }).catch(e => {
        console.error(e)
        ElMessage.error("取关失败,请重试")
      }).finally(() => {
        this.unfollowing = false;
      })
    },
  },
  mounted() {
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
    disableFollowButton: {
      type: Boolean,
      default: false,
    }
  },
}

</script>

<style scoped>
.user-title {
  text-align: left;

}

.social-link {
  margin-right: 5px;
}
</style>