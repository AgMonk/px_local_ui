<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>
{{data}}
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "ArtworkDetail",
  data() {
    return {
      data:{},
    }
  },
  computed: {},
  methods: {
    ...mapActions("Artworks", [`getIllustInfo`]),

  },
  mounted() {
    const pid = Number(this.$route.params.pid)
    this.getIllustInfo({pid}).then(res=>{
      console.log(res)
      this.data = res
    }).catch(reason=>{
      console.log(reason)
      const {message, status,} = reason
      ElMessage.error(`${status}: ${message}`)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>