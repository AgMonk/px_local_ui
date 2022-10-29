<template>
  <el-tooltip :disabled="disableTooltip" placement="top-start">
    <router-link :to="{name:'绘画详情',params:{pid}}">
      <el-link :underline="false">
        <slot />
      </el-link>
    </router-link>
    <template #content>
      <el-form>
        <el-form-item v-if="title" label="标题">
          <copy-span :text="title" />
        </el-form-item>
        <el-form-item label="Pid">
          <copy-span :text="pid" />
        </el-form-item>
        <el-form-item label="官方">
          <el-link :href="`https://www.pixiv.net/artworks/${pid}`" target="_blank" type="primary">
            官方地址
          </el-link>
        </el-form-item>
      </el-form>
    </template>
  </el-tooltip>
</template>

<script>
import CopySpan from "@/components/v2/copy/copy-span";

export default {
  name: "illust-link",
  components: {CopySpan},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    pid: {
      type: Number,
      required: true,
    },
    title: {},
    disableTooltip: {
      type: Boolean,
    }
  },
}

</script>

<style scoped>

</style>