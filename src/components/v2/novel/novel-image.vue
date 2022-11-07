<template>
  <div v-if="data" class="novel-image">
    <el-image v-if="data.coverUrl && info.showImage"
              :src="data.coverUrl.replace('https://i.pximg.net','/pximg')"
              style="border-radius:15px"
              @error="failed"
              @load="success"
    />


  </div>

</template>

<script>
import {mapGetters} from "vuex";

const name = ""

export default {
  name: "novel-image",
  data() {
    return {
      data: undefined,
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
      console.log(this.data)
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
    size: {
      type: Number,
      default: 150,
    },
  },
}

</script>

<style scoped>
.novel-image {
  display: inline-block;
  position: relative;
}
</style>