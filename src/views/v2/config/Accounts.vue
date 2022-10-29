<template>
  <el-container v-loading="loading" direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header>账号管理</el-header>-->
    <el-main>
      <el-form>
        <el-form-item label="当前账号">
          <el-select v-model="uid" @change="change">
            <el-option v-for="account in accounts" :label="account.name" :value="account.uid" />
          </el-select>
          <el-button type="success" @click="add">添加</el-button>
          <el-button type="danger" @click="confirmLogout">登出</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "accounts",
  data() {
    return {
      data: undefined,
      uid: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState("Account", ["accounts", "current"])
  },
  methods: {
    ...mapMutations("Account", ['logout', 'changeCurrent']),
    ...mapGetters("Account", ["getCurrent"]),
    ...mapActions("Account", ["login",]),
    confirmLogout() {
      ElMessageBox.confirm(`确认登出: ${this.data.name}`, "确认",).then(() => {
        this.logout(this.uid)
        location.reload()
      })
    },
    change(uid) {
      this.changeCurrent(uid)
      this.init();
    },
    add() {
      ElMessageBox.prompt('请输入phpSessionId', `登录`, {}).then(res => {
        this.loading = true
        this.login(res.value).then(res => {
          this.loading = false
          ElMessage.success("登录成功:" + res.name)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    load(route, force) {
      this.data = this.getCurrent();
      this.uid = this.data ? this.data.uid : undefined;
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    current(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>