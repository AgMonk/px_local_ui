<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-form @submit.prevent>
        <el-form-item>
          <el-input id="输入框" v-model="keyword" clearable size="small" style="max-width: 70%" @keyup.enter="route2Search(keyword)" />
          <el-button size="small" style="margin-left: 5px" type="primary" @click="route2Search(keyword)">搜索</el-button>
          <el-dropdown size="small" split-button style="margin-left: 5px" type="primary" @click="saveKeyword" @command="route2Search($event)">
            保存
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in savedKeywords" :command="item.keyword">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {search} from "@/assets/js/request/search";

export default {
  name: "Search",
  data() {
    return {
      keyword: "",
      page: 1,
      savedKeywords: [],
    }
  },
  computed: {},
  methods: {
    route2Search(keyword, page = 1) {
      this.$router.push({name: "搜索结果", params: {keyword, page}})
    },
    search(keyword = this.keyword, page = 1) {
      this.keyword = keyword
      this.page = page;

      search(keyword, {page})
    },
    saveKeyword() {
      ElMessageBox.prompt('保存名称', {}).then(res => {
        const {value, action} = res
        if (action === 'confirm') {
          this.savedKeywords.push({label: value, keyword: this.keyword})
          ElMessage.success("已保存搜索")
        }
      }).catch(reason => {
        if (reason === 'cancel') {
          ElMessage.info("已取消")
        } else {
          console.log(reason)
          ElMessage.error("无法识别")
        }
      })
    },
    load(route) {
      if (!route.path.startsWith('/search')) {
        return;
      }
      const {keyword, page} = route.params
      if (keyword && page) {
        this.search(keyword, page)
      }
    },
  },
  mounted() {
    setTitle("搜索")
    document.getElementById('输入框').focus()
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>