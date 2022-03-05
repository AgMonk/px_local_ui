<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
    </el-header>
    <el-main>
      <el-divider content-position="left">配置</el-divider>
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
      <div>
        <el-divider content-position="left">屏蔽选项</el-divider>
        <el-tabs type="border-card">
          <el-tab-pane label="UID">
            <h4>根据UID屏蔽作品</h4>
            <el-button size="small" type="primary" @click="addTag('uid')">添加</el-button>
            <div style="text-align: left">
              <el-tag v-for="uid in configuration.filter.uid" class="filter-tag" closable effect="dark" @close="closeTag('uid',uid)">{{ uid }}&nbsp;({{ getName(uid) }})</el-tag>
            </div>
          </el-tab-pane>
          <el-tab-pane label="标题">
            <h4>根据标题中出现的关键字屏蔽作品</h4>
            <el-button size="small" type="primary" @click="addTag('title')">添加</el-button>
            <div style="text-align: left">
              <el-tag v-for="keyword in configuration.filter.title" class="filter-tag" closable effect="dark" @close="closeTag('title',keyword)">{{ keyword }}</el-tag>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户名">
            <h4>根据用户名中出现的关键字屏蔽作品</h4>
            <el-button size="small" type="primary" @click="addTag('username')">添加</el-button>
            <div style="text-align: left">
              <el-tag v-for="keyword in configuration.filter.username" class="filter-tag" closable effect="dark" @close="closeTag('username',keyword)">{{ keyword }}</el-tag>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-dialog v-model="dialogShow.cookie" close-on-click-modal title="设置Cooke和Token">
        <el-form>
          <el-form-item>
            <template #label>
              <span class="label-text">token</span>
            </template>
            <el-input ref="token-input" v-model="form.cookie.token" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <span class="label-text">cookie</span>
            </template>
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
import {mapGetters, mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/js/request/request";
import {ElMessage, ElMessageBox} from "element-plus";

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
        filter: {
          uid: [],
          //作品标题关键字屏蔽
          title: [],
          //作者名称关键字屏蔽
          username: [],
        },
      },
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapGetters("User", [`getUserFromCache`]),
    ...mapMutations('Config', [`setAccounts`, `setConfig`, `addFilter`, `delFilter`]),
    openDialogCookie() {
      this.dialogShow.cookie = true
      setTimeout(() => this.$refs['token-input'].focus(), 500)
    },
    closeTag(key, value) {
      ElMessageBox.confirm("确认移除?").then(() => {
        this.delFilter({key, value})
      }).catch(reason => {
        console.log(reason)
        ElMessage.info("已取消")
      })
    },
    addTag(key) {
      ElMessageBox.prompt(`请输入 ${key}`).then(value => {
        this.addFilter({key, value: value.value})
      }).catch(reason => {
        console.log(reason)
        ElMessage.info("已取消")
      })
    },
    getName(uid) {
      const user = this.getUserFromCache()(uid)
      return user ? user.name : '';
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
.label-text {
  color: white
}

.filter-tag {
  margin-right: 3px;
}
</style>