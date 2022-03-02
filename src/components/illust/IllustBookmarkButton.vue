<template>
  <el-icon v-if="loading" :size="size">
    <alarm-clock />
  </el-icon>
  <el-icon v-else-if="bookmarked" :size="size" class="clickable" color="red">
    <star-filled />
  </el-icon>
  <el-icon v-else :size="size" class="clickable">
    <star />
  </el-icon>
</template>

<script>
import {AlarmClock, Star, StarFilled} from '@element-plus/icons-vue';

export default {
  name: "IllustBookmarkButton",
  components: {StarFilled, Star, AlarmClock},
  data() {
    return {
      loading: false,
      bookmarked: false,
    }
  },
  computed: {},
  methods: {
    update(o) {
      this.bookmarked = o && o.id;
    }
  },
  mounted() {
    this.update(this.bmkData)
  },
  watch: {
    bmkData(to) {
      this.update(to)
    },
  },
  props: {
    bmkData: {},
    size: {type: Number, default: 30},
  },
}

</script>

<style scoped>

</style>