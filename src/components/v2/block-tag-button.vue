<template>
  <span>
    <el-button size="small" type="danger" @click="show=true">屏蔽标签</el-button>


    <el-dialog v-model="show" append-to-body title="屏蔽标签">
      <div style="color:white">
        <ul>
          <li>当选中多个标签时,表示当作品同时持有这些标签时才会屏蔽</li>
        </ul>
      </div>
      <el-form @submit.prevent>
        <el-form-item>
          <template #label>
            <span style="color:white">标签</span>
          </template>
          <el-select v-model="selection" :multiple="true" style="width: 100%">
            <el-option v-for="item in options" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="success" @click="confirm">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>

import {ArrayUtils} from "gin-utils/dist/utils/ArrayUtils";
import {mapMutations} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "block-tag-button",
  data() {
    return {
      show: false,
      options: [],
      selection: [],
    }
  },
  computed: {},
  methods: {
    ...mapMutations("Config", ['addBlock']),
    confirm() {
      this.show = false;
      let type = "tagRules"
      if (this.selection.length === 0) {
        return
      }
      if (this.selection.length === 1) {
        this.addBlock({
          type, value: this.selection[0],
        })
        ElMessage.success("添加成功")
        this.selection = []
      } else {
        this.addBlock({
          type, value: this.selection,
        })
        ElMessage.success("添加成功")
        this.selection = []
      }

    },
    load(tagList) {
      this.selection = [];
      let array = tagList.flatMap(i => {
        const {tag, translation} = i;
        return [tag, translation]
      }).filter(i => !!i)
      this.options = ArrayUtils.distinct(array, i => i)
    }
  },
  mounted() {
    this.load(this.tags)
  },
  watch: {
    tags(to) {
      this.load(to)
    }
  },
  props: {
    tags: {type: Object, required: true},
  },
}

</script>

<style scoped>

</style>