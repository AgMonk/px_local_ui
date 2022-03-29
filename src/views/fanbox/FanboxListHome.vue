<template>
  <el-container v-loading="loading" direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-scrollbar height="500px">
        <el-table :data="data">
          <el-table-column label="时间" prop="timestamp.updated" width="170px" />
          <el-table-column label="作者" width="130px">
            <template #default="s">
              <router-link :to="{name: 'fanbox创作者作品',params:{id:s.row.user.userId,page:1}}">
                <el-link type="primary">{{ s.row.user.name }}</el-link>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="方案费用" prop="feeRequired" width="80px" />
          <el-table-column label="标题">
            <template #default="s">
              <router-link :to="{name: 'fanbox作品详情',params:{id:s.row.id}}">
                <el-link type="primary">{{ s.row.title }}</el-link>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div style="color:white">
          加载中...
        </div>
      </el-scrollbar>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "FanboxListHome",
  data() {
    return {
      params: {
        limit: 10,
        maxId: undefined,
        maxPublishedDatetime: undefined,
      },
      loading: false,
      data: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("Fanbox", [`listHome`]),
    scrollLoad() {
      if (this.loading) {
        return
      }
      this.load(this.$route)
    },
    load(route, force) {
      this.loading = true;
      this.listHome({force, ...this.params}).then(res => {
        this.loading = false;
        console.log(res)
        this.params = res.params;
        this.data.push(...res.items);
      })
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {

    }
  },
  props: {},
}

</script>

<style scoped>

</style>