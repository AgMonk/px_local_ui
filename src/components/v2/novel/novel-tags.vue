<template>
  <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
    <div v-for="item in data" class="tag-row">
      <copy-span :text="item.tag" />
      <span style="margin-left: auto">{{ item.cnt }}</span>
    </div>
  </retry-div>
</template>

<script>

import RetryDiv from "@/components/v2/retry-div";
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";
import CopySpan from "@/components/v2/copy/copy-span";

export default {
  name: "novel-tags",
  data() {
    return {
      data: [],
      params: {
        uid: this.uid,
        force: false,
      },
    }
  },
  components: {CopySpan, RetryDiv},
  computed: {},
  methods: {
    ...mapActions("User", ['novelsTags']),
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    success(res) {
      this.data = res;
    },
    request({uid, force}) {
      return this.novelsTags({uid, force})
    },
    load(uid, force) {
      this.params = {uid, force}
    }
  },
  mounted() {
  },
  watch: {
    uid(to) {
      this.load(to)
    }
  },
  props: {
    uid: {type: Number, required: true}
  },
}

</script>

<style scoped>
.tag-row {
  display: flex;
  justify-content: flex-start;
  color: white;
  padding: 0 8px;
}
</style>