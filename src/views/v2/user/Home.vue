<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <user-title v-if="uid" :avatar-size="50" :disable-follow-button="getCurrent().uid===uid" :font-size="30" :uid="uid" />
    </el-header>
    <el-main>
      <el-radio-group v-model="type" size="large" @change="typeChanged">
        <el-radio-button v-for="item in types" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
      <router-view />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import UserTitle from "@/components/v2/user/user-title";
import {Title} from "gin-utils/dist/utils/DomUtils";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Home",
  components: {UserTitle},
  data() {
    return {
      uid: undefined,
      type: undefined,
      types: [
        {label: '插画', value: 'illust'},
        {label: '漫画', value: 'manga'},
        {label: '小说', value: 'novel'},
        {label: '收藏', value: 'bookmark'},
        {label: '约稿', value: 'request'},
      ],
      profile: {},
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Account", ['getCurrent']),
    ...mapActions('User', ['profileAll']),
    typeChanged(e) {
      this.$router.push(`/user/${this.uid}/${e}`)
    },
    load(route, force) {
      this.type = route.path.split('/')[3]
      this.uid = Number(route.params.uid);

      this.profileAll({uid: this.uid, force}).then(res => {
        console.log(res)
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