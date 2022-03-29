<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>
      <el-form label-width="90px" @submit.prevent>
        <el-form-item label="单个作品ID">
          <el-input v-model="form.itemId" style="width:180px" />
          <el-button type="primary" @click="$router.push({name:'fanbox作品详情',params:{id:form.itemId}})">跳转</el-button>
        </el-form-item>
        <el-form-item label="作者ID">
          <el-input v-model="form.userId" style="width:180px" />
          <el-button type="primary" @click="$router.push({name:'fanbox创作者作品',params:{id:form.userId}})">跳转</el-button>
        </el-form-item>

      </el-form>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "FanboxIndex",
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
    this.listFollowing().then(res => {
      console.log(res)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>