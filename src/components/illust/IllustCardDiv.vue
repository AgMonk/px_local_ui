<template>
  <div>
    <div>
      <el-row>
        <el-col :span="12">
          <span v-if="showDateRange && maxDate" class="common-text" style="margin-left: 2px">
            <el-tag effect="dark">{{ maxDate }}</el-tag>
            ~
            <el-tag effect="dark">{{ minDate }}</el-tag>
          </span>
          <el-tag v-if="query.normal.length>0" effect="dark" style="margin-left: 2px">队列：{{ query.normal.length }}</el-tag>
        </el-col>
        <el-col :span="12">
          <el-button v-if="!disableRefresh" size="small" style="margin-right: 3px;" type="primary" @click="$emit('refresh')">刷新</el-button>
          <el-button v-for="item in modes" v-show="counts[item.name]>0" size="small" style="margin-right: 3px;" type="primary" @click="dialogShow[item.name]=true">
            {{ item.title }}({{ counts[item.name] }})
          </el-button>
        </el-col>
      </el-row>

    </div>
    <el-scrollbar :height="`${height}px`">
      <illust-card v-for="pid in data.normal" :pid="pid" @image-load="threads.normal.current--;" />
    </el-scrollbar>

    <el-dialog v-for="item in modes" v-model="dialogShow[item.name]" :title="item.title" close-on-click-modal width="90%" @close="mode='normal'" @open="mode=item.name">
      <el-scrollbar :height="`${207*2.5}px`">
        <illust-card v-for="pid in data[item.name]" :pid="pid" @image-load="threads[item.name].current--;" />
      </el-scrollbar>
    </el-dialog>
  </div>

</template>

<script>
import IllustCard from "@/components/illust/IllustCard";
import {mapGetters} from "vuex";

export default {
  name: "IllustCardDiv",
  components: {IllustCard},
  emits: ['load-image', 'refresh'],
  data() {
    return {
      //显示的作品pid: 常规、已收藏、已屏蔽
      data: {
        normal: [],
        bookmarked: [],
        filter: [],
      },
      //待添加的pid: 常规、已收藏、已屏蔽
      query: {
        normal: [],
        bookmarked: [],
        filter: [],
      },
      //线程： 当前，最大
      threads: {
        normal: {
          current: 0,
          max: 2,
        },
        bookmarked: {
          current: 0,
          max: 2,
        },
        filter: {
          current: 0,
          max: 2,
        },

      },
      counts: {
        bookmarked: 0,
        filter: 0,
      },
      dialogShow: {
        bookmarked: false,
        filter: false,
      },
      //完整作品pid
      fullData: [],
      //当前展示的作品类型
      mode: 'normal',
      modes: [
        {name: 'bookmarked', title: '已收藏'},
        {name: 'filter', title: '已过滤'},
      ],
      //自动加载
      internal: 0,
      maxDate: "",
      minDate: "",
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Artworks", [`getIllustFromCache`]),
    dataInit() {
      this.data = {normal: [], bookmarked: [], filter: [],}
      this.query = {normal: [], bookmarked: [], filter: [],}
      this.fullData = []
      this.threads.current = 0;
    },
    clear(array) {
      this.dataInit();
      if (array) {
        this.addQuery(array)
      }
    },
    //判断作品已被收藏
    isBookmarked(illust) {
      return illust && illust.bmkData
    },
    //判断作品应该被屏蔽
    isFilter(illust) {
      //todo
      return false;
    },
    //  设置时间跨度
    setDateRange() {
      const max = Math.max(...this.fullData)
      const min = Math.min(...this.fullData)
      console.log(`${min}~${max}`)
      this.maxDate = this.getIllustFromCache()(max).timestamp.create.substring(5, 16)
      this.minDate = this.getIllustFromCache()(min).timestamp.create.substring(5, 16)
    },
    addQuery(array) {
      this.fullData.push(...array)
      this.setDateRange();

      if (this.disableGroup) {
        this.query.normal.push(...array)
        console.log(`添加作品卡队列 ${array.length} 个`)
      } else {
        const fullData = array.map(id => this.getIllustFromCache()(id))
        const normalData = fullData.filter(item => !this.isBookmarked(item)).filter(item => !this.isFilter(item))
        const bookmarkedData = fullData.filter(item => this.isBookmarked(item)).filter(item => !this.isFilter(item))
        const filterData = fullData.filter(item => this.isFilter(item))

        this.query.normal.push(...normalData.map(i => i.id))
        this.query.bookmarked.push(...bookmarkedData.map(i => i.id))
        this.query.filter.push(...filterData.map(i => i.id))

        console.log(`添加作品卡队列 ${array.length} 个 其中 常规 ${normalData.length} 个 已收藏 ${bookmarkedData.length} 个 已屏蔽 ${filterData.length} 个`)

        this.counts.bookmarked = this.data.bookmarked.length + this.query.bookmarked.length;
        this.counts.filter = this.data.filter.length + this.query.filter.length;
      }
    },
  },
  mounted() {
    this.internal = setInterval(() => {
      const mode = this.mode
      const count = this.threads[mode].max - this.threads[mode].current
      if (this.query[mode].length > 0 && count > 0) {
        this.data[mode].push(...this.query[mode].splice(0, count))
        this.threads[mode].current += count;
        //报告队列剩余数量
        this.$emit('load-image', this.query)
      }
    }, 300)
  },
  unmounted() {
    clearInterval(this.internal)
  },
  watch: {},
  props: {
    showDateRange: {type: Boolean, default: true},
    disableGroup: {type: Boolean, default: false},
    height: {type: Number, default: 651},
    disableRefresh: {type: Boolean, default: false},
  },
}

</script>

<style scoped>
</style>