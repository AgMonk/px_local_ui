<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <load-more-div :init-request="request" :load-more-request="request" :max-height="600" :params="params" @success="success">
        <illust-card-group ref="cardGroup" />
      </load-more-div>
    </el-main>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import {mapActions} from "vuex";
import LoadMoreDiv from "@/components/v2/load-more-div";

export default {
  name: "Illust",
  components: {LoadMoreDiv, IllustCardGroup,},
  data() {
    return {
      params: {
        mode: "all",
        limit: 24,
        sampleIllustId: undefined,
      },
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['discovery']),
    request(params) {
      return this.discovery(params)
    },
    success(res) {
      console.log(res)
      this.$nextTick(() => {
        this.$refs.cardGroup.add(res)
      })
    },
    load(route, force) {

    }
  },
  mounted() {
    Title.set('发现绘画')
  },
  watch: {
    $route(to) {
      if (to.name === '发现绘画') {
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>