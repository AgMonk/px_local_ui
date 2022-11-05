<template>
  <el-container direction="vertical" style="background-color: rgba(1,48,133,0.3)">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <div>
        <h2 style="color: white;text-align: left;">推荐作品</h2>
      </div>
      <load-more-div
          :has-next="hasNext"
          :init-request="init"
          :load-more-request="loadMore"
          :max-height="700"
          :params="ids"
          @failed="failed"
          @success="success"
      >
        <illust-card-group ref="cardGroup" />
      </load-more-div>
    </el-main>
  </el-container>

</template>

<script>
import LoadMoreDiv from "@/components/v2/load-more-div";
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";

const name = ""

export default {
  name: "illust-recommend",
  components: {IllustCardGroup, LoadMoreDiv},
  data() {
    return {
      data: [],
      ids: [],
      nextIds: [],
      hasNext: true,
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['recommendInit', 'recommendIllusts']),
    init() {
      return this.recommendInit(this.pid);
    },
    loadMore(ids) {
      return this.recommendIllusts(ids)
    },
    //成功回调
    success(response, isInit) {
      if (isInit) {
        const {illusts, nextIds} = response
        this.nextIds = nextIds;
        this.$refs.cardGroup.add(illusts)
      } else {
        this.$refs.cardGroup.add(response)
      }
      if (this.nextIds.length === 0) {
        this.hasNext = false;
      } else {
        this.ids = this.nextIds.splice(0, Math.min(10, this.nextIds.length))
      }
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
  },
  mounted() {
  },
  watch: {
    pid(to) {
    }
  },
  props: {
    pid: {
      type: Number,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>