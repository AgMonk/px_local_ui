<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-table :data="data">
        <el-table-column label="时间" prop="timestamp.updated" width="170px" />
        <el-table-column label="作者" width="130px">
          <template #default="s">
            <router-link :to="{name: 'fanbox创作者作品',params:{id:s.row.creatorId,page:1}}">
              <el-link type="primary">{{ s.row.user.name }}</el-link>
            </router-link>
            </template>
          </el-table-column>
          <el-table-column label="方案费用" prop="feeRequired" width="80px" />
          <el-table-column label="标题" width="300px">
            <template #default="s">
              <router-link :to="{name: 'fanbox作品详情',params:{id:s.row.id}}">
                <el-link type="primary">{{ s.row.title }}</el-link>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="标签">
            <template #default="s">
              <el-tag v-for="tag in s.row.tags" effect="dark">{{ tag }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      <div v-loading="loading" style="color:white">
        <el-button type="primary" @click="scrollLoad">加载更多</el-button>
      </div>
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
        return;
      }
      console.log(this.loading)
      this.load(this.$route)
    },
    load(route, force) {
      this.loading = true;
      this.listHome(force).then(res => {
        console.log(res)
        this.data = res;
        this.$nextTick(() => {
          this.loading = false;
        })
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
.el-tag {
  margin-left: 5px;
}
</style>