<template>
  <div style="margin-bottom: 5px">
    {{ data }}
  </div>
</template>

<script>
const name = "评论"

export default {
  name: "comment",
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
    //评论数据
    data: {type: Object, required: true},
    //类型 只能为 illusts 或 novels
    worksType: {type: String, required: true},
    //作品id
    workId: {type: Number, required: true,},
    //是否为根评论
    isRoot: {type: Boolean, default: false,},
  },
}

</script>

<style scoped>

</style>