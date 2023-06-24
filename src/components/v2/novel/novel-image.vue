<template>
  <div v-if="data" class="novel-image">
    <el-image v-if="info.showImage"
              :src="src"
              :style="{
                'border-radius':'15px',
              }"
              @error="failed"
              @load="success"
    />


  </div>

</template>

<script>
import {mapGetters} from "vuex";
import {IMG_URL_PREFIX} from "@/assets/v2/domain"

const name = ""

export default {
  name: "novel-image",
  data() {
    return {
      data: undefined,
      src: undefined,
    }
  },
  emits: ['failed', 'success', "novel-bookmark-success"],
  components: {},
  computed: {},
  methods: {
    ...mapGetters("Novel", ['getNovel']),
    failed() {
      this.$emit("failed", this.id)
    },
    success() {
      this.loading = false;
      this.$emit("success", this.id)
    },
    load(info) {
      this.data = this.getNovel()(info.id);
      // this.src = '/pximg/c/600x600/novel-cover-master/img/2022/10/04/09/11/35/ci185806_983b9b0b0136aad09ad637fa64fe61c5_master1200.jpg'
      this.src = this.data.coverUrl.replace('https://i.pximg.net', IMG_URL_PREFIX)
    }
  },
  mounted() {
    this.load(this.info)
  },
  watch: {
    info(to) {
      this.load(to)
    }
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
}

</script>

<style scoped>
.novel-image {
  display: inline-block;
  position: relative;
  text-align: right;
}
</style>