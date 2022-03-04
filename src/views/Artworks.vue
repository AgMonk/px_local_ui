<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-tabs
          v-model="currentTab"
          class="demo-tabs"
          editable
          type="card"
          @edit="handleTabsEdit"
          @tab-click="routeToPid($event.props.name)"
      >
        <el-tab-pane
            v-for="item in artworks"
            :key="item.id"
            :label="item.title"
            :name="item.id"
        />
      </el-tabs>

    </el-header>
    <el-main v-loading="!show"
             :element-loading-spinner="svg"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="加载中..."
    >
      <div v-if="!show" style="height:200px"></div>
      <router-view v-else />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";
import {setTitle} from "@/assets/js/request/request";
import {autoRetry} from "@/assets/js/utils/RequestUtils";

export default {
  name: "Artworks",
  data() {
    return {
      currentTab: "",
      show: false,
    }
  },
  computed: {
    ...mapState("Artworks", [`artworks`]),
    ...mapState("Loading", [`svg`]),
  },

  methods: {
    ...mapActions("Artworks", [`getIllustInfo`]),
    ...mapMutations("Artworks", [`delTab`, `addTab`]),
    handleTabsEdit(id, action) {
      if (action === 'remove') {
        this.delTab(id)
        console.log("移除标签 pid = " + id)
        if (this.artworks.length > 0) {
          const pidList = this.artworks.map(i => i.id)
          if (!pidList.includes(this.currentTab)) {
            this.routeToPid(pidList[0])
          }
        } else {
          const path = this.$route.query.from ? this.$route.query.from : '/home'
          this.$router.push(path)
        }
      }
      if (action === 'add') {
        ElMessageBox.prompt('输入Pid或地址', {}).then(res => {
          const {value, action} = res
          if (action === 'confirm') {
            if (!isNaN(value)) {
              this.getInfo(value)
            }else{
              const pattern = /artworks\/(\d+)/
              const match = pattern.exec(value)
              if (match){
                this.getInfo(Number(match[1]))
              }
            }
          }
        }).catch(reason => {
          if (reason === 'cancel') {
            ElMessage.info("已取消")
          } else {
            console.log(reason)
            ElMessage.error("无法识别")
          }
        })
      }
    },
    getInfo(pid) {
      if (isNaN(pid)){
        return;
      }
      pid = Number(pid)
      if (this.artworks.map(i => i.id).includes(pid)) {
        //pid已经存在
        this.routeToPid(pid)
      } else {
        //pid不存在 请求
        this.show = false;
        this.getIllustInfo({pid}).then(res => {
          this.addTab(res)
          this.routeToPid(pid)
        })
            .catch(reason => autoRetry(reason, () => this.getInfo(pid)))
      }
    },
    load(route) {
      const {name, params} = route
      if (name === '作品详情' && !isNaN(params.pid)) {
        this.getInfo(params.pid)
      } else if (this.artworks[0]) {
        this.routeToPid(this.artworks[0].id)
      } else{
        ElMessage.error("未打开任何作品")
        history.back();
      }
    },
    routeToPid(pid){
      this.currentTab = pid;
      this.show = true
      this.$router.push({params: {pid}, query: this.$route.query})
    }
  },
  mounted() {
    setTitle("作品详情")
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '作品详情' || to.name === '作品详情组') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>