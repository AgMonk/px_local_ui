<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header height="110px">
      <user-title v-if="uid" :avatar-size="50" :disable-follow-button="getCurrent().uid===uid" :font-size="30" :uid="uid" />
    </el-header>
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
        <el-radio-group v-model="type" size="large" @change="typeChanged">
          <el-radio-button v-for="item in types" :disabled="item.count && data[item.count] && data[item.count].length===0 " :label="item.value">
            {{ item.label }}
            <span v-if="item.count && data[item.count] && data[item.count].length>0">({{ data[item.count].length }})</span>
          </el-radio-button>
        </el-radio-group>
        <div v-if="data.pickup &&data.pickup.length>0 && $route.name==='用户主页'" style="text-align: left">
          <h3 style="color: white">精选</h3>
          <el-row>
            <el-col v-for="item in data.pickup" :span="6">
              <el-link v-if="item.type==='fanbox'" :href="item.contentUrl" :underline="false" target="_blank">
                <!--        fanbox 封面-->
                <div class="fanbox-card">
                  <el-image v-if="item.imageUrl" :src="item.imageUrl" class="absolute-center" style="width: 250px;  border-radius: 15px;" />
                  <span class="absolute-center" style="position: absolute;top:50%;transform: translate(-50%,-50%);background-color: rgba(240,248,255,0.41);font-size: 30px">
                    Fanbox</span>
                </div>
              </el-link>
              <illust-image v-if="item.hasOwnProperty('illustType')" :info="item" :size="250" style="margin-right: 10px"></illust-image>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 10px">
          <router-view />
        </div>
      </retry-div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import UserTitle from "@/components/v2/user/user-title";
import {Title} from "gin-utils/dist/utils/DomUtils";
import {mapActions, mapGetters} from "vuex";
import IllustImage from "@/components/v2/illust/illust-image";
import RetryDiv from "@/components/v2/retry-div";
import {ElMessage} from "element-plus";

export default {
  name: "Home",
  components: {RetryDiv, IllustImage, UserTitle},
  data() {
    return {
      uid: Number(this.$route.params.uid),
      type: this.$route.path.split('/')[3],
      types: [
        {label: '插画', value: 'illust', count: 'illusts'},
        {label: '漫画', value: 'manga', count: 'manga'},
        {label: '小说', value: 'novel', count: 'novels'},
        {label: '收藏', value: 'bookmark'},
        {label: '约稿', value: 'request'},
      ],
      profile: {},
      data: {},
      params: {
        force: false,
        uid: Number(this.$route.params.uid),
      },
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Account", ['getCurrent']),
    ...mapActions('User', ['profileAll']),
    //刷新请求
    refresh() {
      this.load(this.$route, true)
    },
    //请求
    request(params) {
      return this.profileAll(params)
    },
    //成功回调
    success(res) {
      this.data = res
      res.pickup.forEach(i => i.showImage = true)
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    //加载方法
    load(route, force) {
      this.getParam(route)
      this.params = {uid: this.uid, force}
    },
    //从路由获取参数
    getParam(route) {
      this.type = route.path.split('/')[3]
      this.uid = Number(route.params.uid);
    },
    typeChanged(e) {
      this.$router.push(`/user/${this.uid}/${e}`)
    },
  },
  mounted() {
    Title.set("用户主页")
  },
  watch: {
    $route(to) {
      if (to.name.startsWith('用户')) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>
.fanbox-card {
  margin-right: 10px;
  border-radius: 15px;
  height: 250px;
  width: 250px;
  display: inline-block;
  text-align: center;
  color: blue;
  /*background-color: aliceblue;*/
  position: relative;
}

.absolute-center {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>