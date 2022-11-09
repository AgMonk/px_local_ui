<template>
  <load-more-div :has-next="hasNext" :init-request="request" :load-more-request="request" :params="params" @success="success">

  </load-more-div>
</template>

<script>
import LoadMoreDiv from "@/components/v2/load-more-div";
import {mapActions} from "vuex";

const name = "评论区"

export default {
  name: "comment-area",
  data() {
    return {
      params: {
        type: this.type,
        id: this.id,
        page: 1,
        force: false,
      },
      data: [],
      hasNext: true,
    }
  },
  components: {LoadMoreDiv},
  computed: {},
  methods: {
    ...mapActions("Comments", ['novelsRoots', 'illustsRoots']),
    success({comments, hasNext}) {
      this.hasNext = hasNext
      console.log(comments)
    },
    request({type, id, page, force}) {
      if (type === 'illusts') {
        return this.illustsRoots({
          force, pid: id, page
        })
      }
      if (type === 'novels') {
        return this.novelsRoots({
          force, nid: id, page
        })
      }
    },
    load({type, id, page}, force) {
      this.params = {type, id, page, force}
    }
  },
  mounted() {
  },
  watch: {
    type(type) {
      this.load({type, id: this.id, page: 1}, false)
    },
    id(id) {
      this.load({type: this.type, id, page: 1}, false)
    },
  },
  props: {
    //类型 只能为 illusts 或 novels
    type: {type: String, required: true},
    //id 根据类型不同 为 pid 或 nid
    id: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>