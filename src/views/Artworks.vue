<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-tabs
          v-model="currentTab"
          class="demo-tabs"
          closable
          type="card"
          @edit="handleTabsEdit"
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
import {ElMessage} from "element-plus";
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
        if (this.artworks.length>0){
          this.currentTab = this.artworks[0].id
        }else{
          this.$router.push('/home')
        }
      }
    },
  },
  mounted() {
    setTitle("作品详情")
    const {name, params} = this.$route
    if (name === '作品详情') {
      const pid = Number(params.pid)
      if (this.artworks.map(i => i.pid).includes(pid)) {
        //pid已经存在
        this.currentTab = pid;
      } else {
        //pid不存在 请求
        this.show = false;
        this.getIllustInfo({pid}).then(res => {
          this.addTab(res)
          this.currentTab = pid;
          this.show = true;
        }).catch(reason=>{
          console.log(reason)
          const {message, status,} = reason
          ElMessage.error(`${status}: ${message}`)
        })
      }
    } else if (this.artworks[0]) {
      this.$router.push({name: '作品详情', params: {pid: this.artworks[0].pid}})
    }
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>