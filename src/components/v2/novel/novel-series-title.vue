<template>
  <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
    <div v-for="(item,index) in data">
      <novel-link :nid="item.id" disable-tooltip type="primary">
        <span>{{ index + 1 }}# {{ item.title }}</span>
      </novel-link>
    </div>
  </retry-div>
</template>

<script>
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";
import RetryDiv from "@/components/v2/retry-div";
import NovelLink from "@/components/v2/novel/novel-link";

const name = ""

export default {
  name: "novel-series-title",
  data() {
    return {
      params: {seriesId: this.seriesId, force: false},
      data: [],
    }
  },
  components: {NovelLink, RetryDiv},
  computed: {},
  methods: {
    ...mapActions("Novel", ['seriesTitles']),
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    success(res) {
      console.log(res)
      this.data = res;
    },
    request({seriesId, force}) {
      return this.seriesTitles({seriesId, force})
    },
    load(seriesId, force) {
      this.params = {seriesId, force}
    }
  },
  mounted() {
  },
  watch: {
    seriesId(to) {
      this.load(to)
    }
  },
  props: {
    seriesId: {type: Number, required: true}
  },
}

</script>

<style scoped>

</style>