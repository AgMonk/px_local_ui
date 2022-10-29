<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main style="text-align: left ;padding-left: 10px;padding-right: 10px">
      <el-row style="text-align: left">
        <!--     刷新按钮-->
        <el-col :span="12">
          <el-button size="small" type="success" @click="$emit('request-refresh')">刷新</el-button>
        </el-col>
        <el-col :span="12">
          <el-button v-if="bookmarked.length>0" size="small" type="primary" @click="dialogShow.bookmarked=true">已收藏({{ bookmarked.length }})</el-button>
          <el-button v-if="blocked.length>0" size="small" type="primary" @click="dialogShow.blocked=true">已屏蔽({{ blocked.length }})</el-button>
        </el-col>
      </el-row>
      <!--      常规-->
      <illust-card-div :data="normal" style="margin-top: 5px" />
      <!--      已收藏-->
      <el-dialog v-if="bookmarked.length>0" v-model="dialogShow.bookmarked" append-to-body close-on-click-modal title="已收藏" width="90%">
        <el-scrollbar :height="scrollbarHeight">
          <illust-card-div :data="bookmarked" />
        </el-scrollbar>
      </el-dialog>
      <!--      已屏蔽-->
      <el-dialog v-if="blocked.length>0" v-model="dialogShow.blocked" append-to-body close-on-click-modal title="已屏蔽" width="90%">
        <el-scrollbar :height="scrollbarHeight">
          <illust-card-div :data="blocked" />
        </el-scrollbar>
      </el-dialog>

    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapState} from "vuex";
import IllustCardDiv from "@/components/v2/illust/illust-card-div";

export default {
  name: "illust-card-group",
  components: {IllustCardDiv,},
  emits: ['request-refresh'],
  data() {
    return {
      scrollbarHeight: 500,
      normal: [],
      bookmarked: [],
      blocked: [],
      dialogShow: {
        bookmarked: false,
        blocked: false,
      }
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    //清空数据
    clear(illusts) {
      this.normal = []
      this.bookmarked = []
      this.blocked = []
      console.debug("清空作品组")
      this.add(illusts)
    },
    //添加数据
    add(illusts) {
      if (!illusts) {
        return;
      }
      console.debug("添加数据", illusts)
      //todo 过滤掉需要屏蔽的作品


      const {ui, behavior} = this.config
      const {groupBookmarked} = ui;
      if (groupBookmarked) {
        //如果需要分组
        this.normal.push(...illusts.filter(i => !i.bookmarked))
        this.bookmarked.push(...illusts.filter(i => i.bookmarked))
        console.debug(`常规:${this.normal.length}个 已收藏:${this.bookmarked.length}`)
      } else {
        this.normal.push(...illusts);
        console.debug(`常规:${this.normal.length}个 `)
      }
    }
  },
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>