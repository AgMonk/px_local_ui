<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <user-title v-if="uid" :avatar-size="50" :disable-follow-button="getCurrent().uid===uid" :font-size="30" :uid="uid" />
    </el-header>
    <el-main v-loading="loading">
      <div v-if="failed" style="color: white;cursor: pointer;height: 300px" @click="refresh">
        <h3>加载失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-else style="min-height: 300px">
        <el-radio-group v-model="type" size="large" @change="typeChanged">
          <el-radio-button v-for="item in types" :disabled="item.count && data[item.count] && data[item.count].length===0 " :label="item.value">
            {{ item.label }}
            <span v-if="item.count && data[item.count] && data[item.count].length>0">({{ data[item.count].length }})</span>
          </el-radio-button>
        </el-radio-group>
        <div v-if="data.pickup && $route.name==='用户主页'" style="text-align: left">
          <h3 style="color: white">精选</h3>
          <!--        todo fanbox 链接-->
          <illust-image v-for="item in data.pickup.filter(i=>i.hasOwnProperty('illustType'))" :info="item" style="margin-right: 10px"></illust-image>
        </div>
        <router-view v-if="!loading && !failed" />
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
      loading: false,
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
        console.log(res);
        res.pickup.forEach(i => i.showImage = true)
        console.log(res.pickup);
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

</style>