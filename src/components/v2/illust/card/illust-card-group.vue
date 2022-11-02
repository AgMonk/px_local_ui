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
import {mapGetters, mapState} from "vuex";
import IllustCardDiv from "@/components/v2/illust/card/illust-card-div";
import {ObjectUtils} from "gin-utils/dist/utils/ObjectUtils";

//判断一个标签列表是否被屏蔽
const matchTags = function (list, rules) {
  //单个标签规则
  const stringRules = rules.filter(i => ObjectUtils.getTypeOf(i) === 'String')
  //数组规则(同时存在多个标签时才屏蔽)
  const arrayRules = rules.filter(i => ObjectUtils.getTypeOf(i) === 'Array')

  for (let i = 0; i < list.length; i++) {
    let {tag, translation} = list[i]
    if (stringRules.includes(tag) || stringRules.includes(translation)) {
      return true;
    }
  }

  for (let i = 0; i < arrayRules.length; i++) {
    let rule = arrayRules[i]
    if (matchArrayRule(list, rule)) {
      return true;
    }
  }

  return false;
}
//判断一个标签列表是否被数组规则匹配
const matchArrayRule = function (list, arrayRule) {
  for (let i = 0; i < arrayRule; i++) {
    let rule = arrayRule[i]
    if (!list.includes(rule)) {
      return false;
    }
  }
  return true;
}

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
    ...mapGetters("Illust", ['getBookmarkData', 'getIllust']),
    ...mapGetters("User", ['getUser']),
    //清空数据
    clear(illusts) {
      this.normal = []
      this.bookmarked = []
      this.blocked = []
      console.debug("清空作品组")
      this.add(illusts)
    },
    isBookmarked(id) {
      return !!this.getBookmarkData()(id)
    },
    //判断一个作品是否被屏蔽
    isBlocked({id, uid}) {
      //4种屏蔽策略
      const {tagList, titleKeywords, userIdList, usernameKeywords,} = this.config.blocks
      // todo 屏蔽逻辑

      //uid匹配
      if (userIdList.includes(uid)) {
        return true
      }
      //用户名关键字匹配
      let user = this.getUser()(uid)
      if (user && user.hasOwnProperty('name')) {
        const name = user.name
        for (let i = 0; i < usernameKeywords.length; i++) {
          let item = usernameKeywords[i]
          if (name.includes(item)) {
            return true;
          }
        }
      }
      let illust = this.getIllust()(id)
      if (illust) {
        //标题关键字匹配
        if (illust.hasOwnProperty("title")) {
          const title = illust.title
          for (let i = 0; i < titleKeywords.length; i++) {
            let item = titleKeywords[i]
            if (title.includes(item)) {
              return true;
            }
          }
        }

        //标签匹配 todo
        const {tagList, tags} = illust
        //选择执行判断的列表
        const list = tags || tagList;
        if (matchTags(list, tagList)) {
          return true;
        }
      }
      return false;
    },
    //添加数据
    add(illusts) {
      if (!illusts) {
        return;
      }
      console.debug("添加数据", illusts)
      illusts.forEach(i => {
        i.blocked = this.isBlocked(i)
      })
      // 过滤掉需要屏蔽的作品
      this.blocked.push(...illusts.filter(i => i.blocked))
      illusts = illusts.filter(i => !i.blocked)

      const {ui, behavior} = this.config
      const {groupBookmarked} = ui;
      if (groupBookmarked) {
        //如果需要分组
        this.normal.push(...illusts.filter(i => !this.isBookmarked(i.id)))
        this.bookmarked.push(...illusts.filter(i => this.isBookmarked(i.id)))
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