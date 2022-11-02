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
          <el-button size="small" type="danger" @click="block">屏蔽</el-button>
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
import {ElMessage, ElMessageBox} from "element-plus";
import {mapMutations} from "vuex";

export default {
  name: "illust-link",
  components: {CopySpan},
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapMutations("Config", ['addBlock']),
    block() {
      console.log("屏蔽标题关键字", this.title)
      ElMessageBox.prompt("屏蔽标题关键字", {
        title: "屏蔽",
        inputValue: this.title
      }).then(({value}) => {
        this.addBlock({
          type: "titleKeywords",
          value,
        })
        ElMessage.success("添加成功")
      }).catch(e => {
        console.error(e)
        ElMessage.info("已取消")
      })
    }
  },
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