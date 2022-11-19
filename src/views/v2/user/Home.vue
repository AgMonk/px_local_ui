<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header height="110px">
      <user-title v-if="uid" :avatar-size="50" :disable-follow-button="getCurrent().uid===uid" :font-size="30" :uid="uid" />
    </el-header>
    <el-main>
      <retry-div :min-height="300" :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
        <!--        子路由切换-->
        <el-row>
          <el-col :span="12" style="text-align: left">

            <el-radio-group v-model="type" @change="typeChanged">
              <el-radio-button v-for="item in types" :disabled="item.count && data[item.count] && data[item.count].length===0 " :label="item.value">
                {{ item.label }}
                <span v-if="item.count && data[item.count] && data[item.count].length>0">({{ data[item.count].length }})</span>
              </el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <span v-if="['illust','novel','manga'].includes(type)" style="margin-left: auto;color:white">
              <!--用户作品使用的标签-->
              <user-work-tag :type="type" :uid="uid" @use-tag="useTag" />
            </span>
          </el-col>
        </el-row>

        <!--        精选作品-->
        <div v-if="data.pickup &&data.pickup.length>0 && $route.name==='用户主页'" style="text-align: left">
          <h3 style="color: white">精选</h3>
          <el-row>
            <el-col v-for="item in data.pickup" :span="6">
              <el-link v-if="item.type==='fanbox'" :href="item.contentUrl" :underline="false" target="_blank">
                <!--        fanbox 封面-->
                <div class="pickup-card">
                  <el-image v-if="item.imageUrl" :src="item.imageUrl" class="absolute-center pickup-image" />
                  <span class="absolute-center" style="background-color: rgba(240,248,255,0.41);font-size: 30px">
                    Fanbox</span>
                </div>
              </el-link>
              <el-link v-if="item.type==='illustSeries'" :href="item.contentUrl" :underline="false" target="_blank">
                <!--        todo 绘画系列 -->
                <div class="pickup-card">
                  <el-image v-if="item.url" :src="item.url" class="absolute-center pickup-image" />
                  <span class="absolute-center" style="background-color: rgba(240,248,255,0.41);font-size: 30px">
                    {{ item.title }}</span>
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
import UserWorkTag from "@/components/v2/user/user-work-tag";
import {routeName} from "@/router/route-name";

export default {
  name: "Home",
  components: {UserWorkTag, RetryDiv, IllustImage, UserTitle},
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
      data: undefined,
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
    useTag(tag) {
      this.$router.push({
        name: routeName.user.workWithTag,
        params: {
          tag, page: 1, type: this.type, uid: this.uid
        }
      })
    },
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
.pickup-card {
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

.pickup-image {
  width: 250px;
  max-height: 250px;
  border-radius: 15px;
}

.absolute-center {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>