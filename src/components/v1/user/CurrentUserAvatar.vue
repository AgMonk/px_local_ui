<template>
  <el-badge style="position: fixed; top: 0; right: 0;">
    <el-dropdown @command="command">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in dropdownItems" :command="item.route">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <user-avatar v-if="showAvatar" :uid="config.uid" />
    </el-dropdown>
  </el-badge>
</template>

<script>
import {mapActions, mapState} from "vuex";
import UserAvatar from "@/components/v1/user/UserAvatar";

export default {
  name: "CurrentUserAvatar",
  components: {UserAvatar},
  data() {
    return {
      dropdownItems: [],
      showAvatar: false,
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions("User", [`getUserInfo`]),
    command(e) {
      this.$router.push(e)
    },
    load(config) {
      this.showAvatar = false;
      const uid = config.uid
      if (uid > 0) {
        this.getUserInfo({uid}).then(() => {
          this.showAvatar = true;
          this.dropdownItems = [
            {name: "我的收藏", route: {name: '用户收藏', params: {uid, page: 1}}},
            {name: "配置", route: {name: "配置"}},
          ]
        }).catch(() => {
          setTimeout(() => this.load(config), 3000)
        })
      }
    },
  },
  mounted() {
    this.load(this.config)
  },
  watch: {
    config(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>