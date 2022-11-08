<template>
  <el-tooltip :disabled="disableTooltip" placement="top-start">
    <router-link :to="{name:'小说详情',params:{nid}}">
      <el-link :type="type" :underline="false">
        <slot />
      </el-link>
    </router-link>
    <template #content>
      <el-form>
        <el-form-item v-if="title" label="标题">
          <copy-span :text="title" />
        </el-form-item>
        <el-form-item label="nid">
          <copy-span :text="nid" />
        </el-form-item>
        <el-form-item label="官方">
          <el-link :href="`https://www.pixiv.net/novel/show.php?id=${nid}`" target="_blank" type="primary">
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
  name: "novel-link",
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
    nid: {
      type: Number,
      required: true,
    },
    title: {},
    type: {type: String,},
    disableTooltip: {
      type: Boolean,
    }
  },
}

</script>

<style scoped>

</style>