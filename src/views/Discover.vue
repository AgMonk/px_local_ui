<!--发现-->
<template>
  <el-container v-loading="loading" :element-loading-spinner="svg"
                direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <el-main style="text-align: left">
      <illust-card-div ref="card-div" @refresh="refresh" @scroll-to-bottom="scroll2bottom" />
      <div v-if="loading" style="height:300px"></div>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import IllustCardDiv from "@/components/illust/IllustCardDiv";
import {ElMessage} from "element-plus";
import {autoRetry} from "@/assets/js/utils/RequestUtils";

export default {
  name: "Discover",
  components: {IllustCardDiv},
  data() {
    return {
      loading: false,
      atBottom: false,
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),
    ...mapState('Discover', [`illusts`]),
  },
  methods: {
    ...mapActions('Discover', [`discover`, 'clear']),
    add(array) {
      this.$refs['card-div'].addQuery(array)
    },
    scroll2bottom(e) {
      if (!this.atBottom) {
        this.atBottom = true;
        this.addIllusts(60).then(() => this.atBottom = false)
      }
    },
    addIllusts(limit, id) {
      ElMessage.success("正在发现...")
      return this.discover({limit, id}).then(res => {
        this.add(res)
      }).catch(reason => autoRetry(reason, () => this.addIllusts(limit, id)))
    },
    refresh() {
      this.loading = true;
      this.clear().then(res => {
        this.$refs['card-div'].clear(res)
        this.loading = false;
      }).catch(reason => autoRetry(reason, () => this.refresh()))
    }
  },
  mounted() {
    setTitle("发现")
    if (this.illusts.length > 0) {
      this.add(this.illusts.map(i => i.id));
    } else {
      this.refresh()
    }

  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>