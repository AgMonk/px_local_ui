<template>
  <span>
    <el-tag effect="dark" size="small">
      <el-icon v-if="locked">
        <Lock />
      </el-icon>
      <copy-span :text="text" />
    </el-tag>
    <copy-span :text="translation" style="color: white;margin-left: 3px;margin-right: 3px" />
  </span>
</template>

<script>
import {Lock} from "@element-plus/icons-vue"
import CopySpan from "@/components/v2/copy/copy-span";

export default {
  name: "illust-tag",
  components: {CopySpan, Lock},
  data() {
    return {
      locked: false,
      text: undefined,
      translation: undefined,
    }
  },
  computed: {},
  methods: {
    load(tag) {
      if ((typeof tag) === 'string') {
        this.text = tag;
        this.locked = false;
        this.translation = undefined;
      }
      if ((typeof tag) === 'object') {
        this.text = tag.tag;
        this.locked = tag.locked;
        this.translation = tag.translation;
      }
    }
  },
  mounted() {
    this.load(this.tag)
  },
  watch: {
    tag(to) {
      this.load(to)
    }
  },
  props: {
    tag: {
      required: true,
    },
  },
}

</script>

<style scoped>

</style>