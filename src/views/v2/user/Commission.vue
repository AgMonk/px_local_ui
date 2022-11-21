<template>
  <retry-div :params="params" :ready="ready" :request="request" unmount-while-loading @failed="failed" @success="success">
    <illust-card-group ref="cardGroup" />
  </retry-div>
</template>

<script>
import {routeName} from "@/router/route-name";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";

const name = routeName.user.commission

export default {
  name: "Commission",
  data() {
    return {
      ready: false,
      size: 48,
      total: 100,
      params: {
        uid: undefined,
      },
    }
  },
  components: {IllustCardGroup},
  computed: {},
  methods: {
    ...mapActions("User", ['commissionRequestSent']),
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    success({requests, illust}) {
      console.log(requests)

      this.$nextTick(() => {
        this.$refs.cardGroup.clear(illust)
      })
    },
    request({uid, force}) {
      return this.commissionRequestSent({uid, force})
    },
    load(route, force) {
      const {uid} = route.params
      this.params = {uid: Number(uid), force}
      this.ready = true;
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === name) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>