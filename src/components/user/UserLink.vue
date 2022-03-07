<template>
  <el-tooltip>
    <router-link :to="{name:'用户插画',params:{uid,page:1}}">
      <el-link :style="`font-size: ${size}px;`" :type="type" :underline="false">
        {{ name }}
      </el-link>
    </router-link>
    <template #content>
      <el-link :href="`https://www.pixiv.net/users/${uid}/artworks`" target="_blank" type="primary">
        官方地址
      </el-link>
      <br>
      <my-copy-button :text="`https://www.pixiv.net/users/${uid}/artworks`">复制地址</my-copy-button>
      <my-copy-button :text="uid">复制UID</my-copy-button>
      <div style="margin-top: 3px">
        <el-button size="small" type="primary" @click="addNameFilter">添加用户名屏蔽</el-button>
        <el-button v-if="isFilterExists()('uid',this.uid)" size="small" type="success" @click="delUidFilter">取消UID屏蔽</el-button>
        <el-button v-else size="small" type="danger" @click="addUidFilter">添加UID屏蔽</el-button>
      </div>
    </template>
  </el-tooltip>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import MyCopyButton from "@/components/common/my-copy-button";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "UserLink",
  components: {MyCopyButton},
  data() {
    return {
      href: "",
      name: "",
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", [`getUserFromCache`]),
    ...mapGetters("Config", [`isFilterExists`]),
    ...mapMutations('Config', [`addFilter`, `delFilter`]),
    load(uid) {
      const user = this.getUserFromCache()(uid)
      if (user && user.name) {
        this.name = user.name
      } else {
        this.name = '[未命名用户]';
      }
    },
    addNameFilter() {
      ElMessageBox.prompt('关键字', '添加用户名关键字屏蔽', {
        inputValue: this.name
      }).then(res => {
        this.addFilter({key: 'username', value: res.value})
      }).catch(reason => {
        console.log(reason)
        ElMessage.info("已取消")
      })
    },
    addUidFilter() {
      ElMessageBox.confirm("确认屏蔽该用户?").then(() => {
        this.addFilter({key: 'uid', value: this.uid})
      }).catch(reason => {
        console.log(reason)
        ElMessage.info("已取消")
      })
    },
    delUidFilter() {
      this.delFilter({key: 'uid', value: this.uid})
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
    type: {
      type: String,
      default: 'primary'
    }
  },
}

</script>

<style scoped>

</style>