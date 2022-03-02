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
    <el-main v-loading="!show">
      <router-view v-if="show" />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";
import {setTitle} from "@/assets/js/request/request";

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
  },
  methods: {
    ...mapActions("Artworks", [`getIllustInfo`]),
    ...mapMutations("Artworks", [`delTab`, `addTab`]),
    handleTabsEdit(id, action) {
      if (action === 'remove') {
        this.delTab(id)
        if (this.artworks.length > 0) {
          this.currentTab = this.artworks[0].id
        } else {
          this.$router.push('/home')
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
        this.currentTab = pid;
        this.routeToPid(pid)
        this.show = true
      } else {
        //pid不存在 请求
        this.show = false;
        this.getIllustInfo({pid}).then(res => {
          this.addTab(res)
          this.currentTab = pid;
          this.show = true;
        }).catch(reason => {
          console.log(reason)
          const {message, status,} = reason
          ElMessage.error(`${status}: ${message}`)
        })
      }
    },
    load(route) {
      const {name, params} = route
      if (name === '作品详情' && !isNaN(params.pid)) {
        this.getInfo(params.pid)
      } else if (this.artworks[0]) {
        this.routeToPid(this.artworks[0].pid)
      }
    },
    routeToPid(pid){
      this.$router.push({name: '作品详情', params: {pid}})
    }
  },
  mounted() {
    setTitle("作品详情")
    this.load(this.$route)
  },
  watch: {
  },
  props: {},
}

</script>

<style scoped>

</style>