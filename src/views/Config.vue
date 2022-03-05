<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
    </el-header>
    <el-main>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设置Cooke和Token">
          <el-button type="primary" @click="openDialogCookie">设置Cooke和Token</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="图片服务器">
          <el-radio-group v-model="configuration.domain" size="large" @change="setConfig({key:'domain',value:$event})">
            <el-radio-button label="/pximg">pixiv.net</el-radio-button>
            <el-radio-button label="/pxre">pixiv.re</el-radio-button>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item label="卡片缓存详情">
          <el-tooltip content="显示作品卡片时，缓存该作品的详细信息，这会在卡片上显示作品的收藏数、加速作品详情页的访问速度，但是也会减慢卡片的加载速度" effect="light">
            <el-switch v-model="configuration.detail" active-text="是" inactive-color="red" inactive-text="否" inline-prompt @change="setConfig({key:'detail',value:$event})" />
          </el-tooltip>
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
      },
      configuration: {
        domain: "",
        detail: false,
      },
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapMutations('Config', [`setAccounts`, `setConfig`]),
    openDialogCookie() {
      this.dialogShow.cookie = true
      setTimeout(() => this.$refs['token-input'].focus(), 500)
    }
  },
  mounted() {
    setTitle("配置")
    this.configuration = this.config
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>