<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main v-loading="loading">

      <el-row>
        <el-col :span="12">
          <el-pagination
              v-model:currentPage="params.page"
              :page-size="params.size"
              :total="filterTotal"
              hide-on-single-page
              layout="total, prev, pager, next, jumper"
              @current-change="$router.push({params:{page:$event}})"

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
                     @change="$router.push({query:{filterAvailable:$event?'1':'0'}})"
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
        <el-table-column v-if="!filterAvailable" label="方案费用" prop="feeRequired" width="80px" />
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {setTitle} from "@/assets/js/request/request";

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
      loading: false,
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
      const {id, page} = route.params
      this.params.page = Number(page)
      this.filterAvailable = route.query.filterAvailable === '1'
      this.loading = true;
      this.listCreator({id, force}).then(res => {
        const {items, nextUrl} = res
        this.query = items;
        this.total = items.length;
        this.showPage()
        this.loading = false;
        setTitle(`${items[0].user.name} 作品`, `Fanbox`)
      })
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === 'fanbox创作者作品') {
        console.log(to)
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>