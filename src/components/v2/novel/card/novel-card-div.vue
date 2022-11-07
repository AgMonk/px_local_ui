<template>
  <div style="margin-top: 5px">
    <novel-card v-for="(info,index) in data"
                :key="index"
                :info="info"
                :size="config.ui.cardSize"
                style="margin-right: 5px"
                @success="imageCompleted"
    />
  </div>

</template>

<script>
import NovelCard from "@/components/v2/novel/card/novel-card";
import {mapState} from "vuex";


export default {
  name: "novel-card-div",
  components: {NovelCard},
  data() {
    return {
      threads: 5,
      current: 0,
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    imageCompleted() {
      this.current--;
      this.loadImage()
    },
    loadImage() {
      //加载图片
      let d = this.data.filter(i => !i.showImage);
      //如果线程数未到上限，且还有作品未加载完成
      if (this.current < this.threads && d.length > 0) {
        d[0].showImage = true;
        this.current++;
      }
    },
    load() {
      const count = Math.min(this.threads - this.current, this.data.length)
      for (let i = 0; i < count; i++) {
        this.loadImage()
      }
    }
  },
  mounted() {
    this.load()
  },
  watch: {
    data(to) {
      this.load()
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
}

</script>

<style scoped>

</style>