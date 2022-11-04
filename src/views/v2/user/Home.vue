<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header height="90px">
      <user-title v-if="uid" :avatar-size="50" :disable-follow-button="getCurrent().uid===uid" :font-size="30" :uid="uid" />
    </el-header>
    <el-main v-loading="loading">
      <div v-if="failed" style="color: white;cursor: pointer;height: 300px" @click="refresh">
        <h3>加载失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-else style="min-height: 500px">
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
          <router-view v-if="!loading && !failed" />
        </div>
      </div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import UserTitle from "@/components/v2/user/user-title";
import {Title} from "gin-utils/dist/utils/DomUtils";
import {mapActions, mapGetters} from "vuex";
import IllustImage from "@/components/v2/illust/illust-image";

export default {
  name: "Home",
  components: {IllustImage, UserTitle},
  data() {
    return {
      uid: undefined,
      type: undefined,
      loading: true,
      failed: false,
      types: [
        {label: '插画', value: 'illust', count: 'illusts'},
        {label: '漫画', value: 'manga', count: 'manga'},
        {label: '小说', value: 'novel', count: 'novels'},
        {label: '收藏', value: 'bookmark'},
        {label: '约稿', value: 'request'},
      ],
      profile: {},
      data: {},
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Account", ['getCurrent']),
    ...mapActions('User', ['profileAll']),
    typeChanged(e) {
      this.$router.push(`/user/${this.uid}/${e}`)
    },
    refresh() {
      this.load(this.$route)
    },
    load(route, force) {
      this.type = route.path.split('/')[3]
      this.uid = Number(route.params.uid);
      this.loading = true;
      this.profileAll({uid: this.uid, force}).then(res => {
        this.failed = false;
        this.data = res
        res.pickup.forEach(i => i.showImage = true)
      }).catch(e => {
        console.error(e)
        this.failed = true;
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    Title.set("用户主页")
    this.load(this.$route)
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