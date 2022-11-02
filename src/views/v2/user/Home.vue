<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <user-title v-if="uid" :avatar-size="50" :disable-follow-button="getCurrent().uid===uid" :font-size="30" :uid="uid" />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import UserTitle from "@/components/v2/user/user-title";
import {Title} from "gin-utils/dist/utils/DomUtils";
import {mapGetters} from "vuex";

export default {
  name: "Home",
  components: {UserTitle},
  data() {
    return {
      uid: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Account", ['getCurrent']),
    load(route, force) {
      console.log(route)
      const {uid} = route.params
      this.uid = Number(uid);
    }
  },
  mounted() {
    Title.set("用户")
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '用户') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>