<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>

      <el-row>
        <el-col :span="12">
          <el-pagination
              v-model:currentPage="params.page"
              :page-size="params.size"
              :total="filterTotal"
              hide-on-single-page
              layout="total, prev, pager, next, jumper"
              @current-change="showPage"

          />
        </el-col>
        <el-col :span="12">
          <el-switch v-model="filterAvailable"
                     :width="60"
                     active-text="可用"
                     inactive-color="red"
                     inactive-text="全部"
                     inline-prompt
                     size="large"
                     style="margin-left: 5px"
                     @change="$router.push({query:{filterAvailable:$event}})"
          />
        </el-col>
      </el-row>
      <el-table :data="data">
        <el-table-column label="时间" prop="timestamp.updated" width="170px" />
        <el-table-column label="标题">
          <template #default="s">
            <router-link :to="{name: 'fanbox作品详情',params:{id:s.row.id}}">
              <el-link type="primary">{{ s.row.title }}</el-link>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "FanboxCreator",
  data() {
    return {
      params: {
        page: 1,
        size: 10,
      },
      total: 100,
      filterAvailable: false,
      filterTotal: 100,
      query: [],
      data: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("Fanbox", [`listCreator`]),
    showPage() {
      const {page, size} = this.params
      if (this.filterAvailable) {
        const array = this.query.filter(i => !i.isRestricted)
        this.filterTotal = array.length;
        this.data = array.slice((page - 1) * size, page * size)
      } else {
        this.data = this.query.slice((page - 1) * size, page * size)
        this.filterTotal = this.total
      }
      console.log(this.data)
    },
    load(route, force) {
      const id = route.params.id
      this.filterAvailable = Boolean(route.query.filterAvailable)
      this.listCreator({id, force}).then(res => {
        this.query = res;
        this.total = res.length;
        this.showPage()
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