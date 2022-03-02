<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
    </el-header>
    <el-main>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="设置Cooke和Token">
          <el-button type="primary" @click="openDialogCookie">设置Cooke和Token</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="图片服务器">
          <el-radio-group v-model="form.domain" size="large" @change="setConfig({key:'domain',value:$event})">
            <el-radio-button label="/pximg">pixiv.net</el-radio-button>
            <el-radio-button label="/pxre">pixiv.re</el-radio-button>
          </el-radio-group>
        </el-descriptions-item>
      </el-descriptions>
      <el-dialog v-model="dialogShow.cookie" close-on-click-modal title="设置Cooke和Token">
        <el-form>
          <el-form-item label="token">
            <el-input ref="token-input" v-model="form.cookie.token" />
          </el-form-item>
          <el-form-item label="cookie">
            <el-input v-model="form.cookie.cookies" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="setAccounts(form.cookie);dialogShow.cookie=false">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: "Config",
  data() {
    return {
      dialogShow: {
        cookie: false,
      },
      form: {
        cookie: {
          cookies: "",
          token: "",
        },
        domain: "",
      }
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapMutations('Config', [`setAccounts`, `setConfig`]),
    openDialogCookie() {
      this.dialogShow.cookie = true
      this.$refs['token-input'].focus()
    }
  },
  mounted() {
    setTitle("配置")
    this.form.domain = this.config.domain;
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>