<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-form inline label-width="90px" @submit.prevent>
        <el-form-item label="单个作品ID">
          <el-input v-model="form.itemId" />
          <el-button type="primary" @click="$router.push({name:'fanbox作品详情',params:{id:form.itemId}})">跳转</el-button>
        </el-form-item>
        <el-form-item label="作者ID">
          <el-input v-model="form.userId" />
          <el-button type="primary" @click="$router.push({name:'fanbox创作者作品',params:{id:form.userId}})">跳转</el-button>
        </el-form-item>

      </el-form>

      <div>
        <fanbox-list-home />
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {setTitle} from "@/assets/js/request/request";
import FanboxListHome from "@/views/v1/fanbox/FanboxListHome";

export default {
  name: "FanboxIndex",
  components: {FanboxListHome},
  data() {
    return {
      form: {
        itemId: undefined,
        userId: undefined,
      }
    }
  },
  computed: {},
  methods: {
    ...mapActions("Fanbox", [`listFollowing`]),

  },
  mounted() {
    setTitle("首页", 'Fanbox')
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>