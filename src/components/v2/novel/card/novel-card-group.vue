<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <novel-card-div :data="normal" />
    </el-main>
  </el-container>

</template>

<script>
import {ArrayUtils} from "gin-utils/dist/utils/ArrayUtils";
import NovelCardDiv from "@/components/v2/novel/card/novel-card-div";

const name = ""

export default {
  name: "novel-card-group",
  components: {NovelCardDiv},
  data() {
    return {
      normal: [],


    }
  },
  computed: {},
  methods: {
    clear(novels, popular) {
      this.normal = []
      this.bookmarked = []
      this.blocked = []
      this.popular = popular || []
      console.debug("清空小说组")
      this.add(novels)
    },
    add(novels) {
      if (!novels) {
        return;
      }
      this.normal = ArrayUtils.distinct([...this.normal, ...novels], i => i.id)
    },
    load(route, force) {

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