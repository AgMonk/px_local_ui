<template>
  <el-tooltip :show-after="500" placement="right">
    <router-link :to="{name:'用户主页',params:{uid}}">
      <el-link :style="{'font-size':size+'px'}" :underline="false" type="primary">
        {{ data && data.name }}
      </el-link>
    </router-link>
    <template #content>
      <el-form>
        <el-form-item label="Uid">
          <copy-span :text="uid" />
          <el-button size="small" type="danger" @click="blockUid">屏蔽</el-button>
        </el-form-item>
        <el-form-item v-if="data" label="用户名">
          <copy-span :text="data.name" />
          <el-button size="small" type="danger" @click="blockUsername">屏蔽</el-button>
        </el-form-item>
        <el-form-item label="官方">
          <el-link :href="`https://www.pixiv.net/users/${uid}/artworks`" target="_blank" type="primary">
            官方地址
          </el-link>
        </el-form-item>
      </el-form>
    </template>
  </el-tooltip>

</template>

<script>
import CopySpan from "@/components/v2/copy/copy-span";
import {mapGetters, mapMutations} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "user-link",
  components: {CopySpan},
  data() {
    return {
      data: {},
      interval: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    ...mapMutations("Config", ['addBlock']),
    blockUid() {
      ElMessageBox.confirm("确认屏蔽UID：" + this.uid, "屏蔽").then(() => {
        this.addBlock({
          type: "userIdRules",
          value: this.uid,
        })
        ElMessage.success("添加成功")
      })
    },
    blockUsername() {
      ElMessageBox.prompt("屏蔽用户名关键字", {
        title: "屏蔽",
        inputValue: this.data.name
      }).then(({value}) => {
        this.addBlock({
          type: "usernameKeywordsRules",
          value,
        })
        ElMessage.success("添加成功")
      }).catch(e => {
        console.error(e)
        ElMessage.info("已取消")
      })
    },
    load(uid) {
      this.data = this.getUser()(uid)
      if (!this.data) {
        this.interval = setInterval(() => {
          this.load(uid)
        }, 1000)
        return
      }
      clearInterval(this.interval);
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
    size: {
      type: Number,
      default: 15,
    },
  },
}

</script>

<style scoped>

</style>