<template>
  <div>
    <illust-card v-for="(item,index) in data"
                 :key="index"
                 :info="item"
                 :size="config.ui.cardSize"
                 style="margin-right: 5px"
                 @success="imageCompleted"
                 @illust-bookmark-success="$emit('illust-bookmark-success',$event)"
    />
  </div>
</template>

<script>
import {mapState} from "vuex";
import IllustCard from "@/components/v2/illust/card/illust-card";

export default {
  name: "illust-card-div",
  components: {IllustCard},
  data() {
    return {
      threads: 5,
      current: 0,
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  emits: ["success", "error", 'illust-bookmark-success'],
  methods: {
    //todo 加载卡片时，缓存它的详情数据

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
    data(e) {
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