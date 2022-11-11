<template>
  <router-link :to="{name:'小说系列',params:{seriesId}}">
    <el-link :type="type" :underline="false">
      <slot />
    </el-link>
  </router-link>

</template>

<script>
const name = ""

export default {
  name: "novel-series-link",
  data() {
    return {}
  },
  components: {},
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    type: {type: String,},
    seriesId: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>