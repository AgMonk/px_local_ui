<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="openDialogCookie">设置Cooke和Token</el-button>
    </el-header>
    <el-main>
      <el-dialog v-model="dialogShow.cookie" title="设置Cooke和Token" close-on-click-modal>
        <el-form>
          <el-form-item label="token">
            <el-input v-model="form.cookie.token" ref="token-input"/>
          </el-form-item>
          <el-form-item label="cookie">
            <el-input v-model="form.cookie.cookies" type="textarea"/>
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
import {mapMutations} from "vuex";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: "Config",
  data() {
    return {
      dialogShow:{
        cookie:false,
      },
      form:{
        cookie:{
          cookies:"",
          token:"",
        }
      }
    }
  },
  computed: {},
  methods: {
    ...mapMutations('Config',[`setAccounts`]),
    openDialogCookie(){
      this.dialogShow.cookie=true
      this.$refs['token-input'].focus()
    }
  },
  mounted() {
    setTitle("配置")
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>