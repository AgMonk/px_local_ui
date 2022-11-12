<template>
  <div style="text-align: left;margin-bottom: 15px">
    <!--    链接-->
    <div class="card-line">
      <novel-link :nid="data.id" type="primary">#{{ data.index }} {{ data.title }}</novel-link>
      <novel-bookmark-button :nid="data.id" :size="25" />
    </div>
    <!--    数据-->
    <div class="card-line" style="color: rgba(255,255,255,0.5)">
      <span v-if="data.hasOwnProperty('reUploadDate')" class="card-info">{{ data.reUploadDate }}</span>
      <span v-else class="card-info">{{ data.uploadDate }}</span>
      <span class="card-info">{{ data.counts.character }}字</span>
      <span class="card-info">
        <el-icon :size="15" color="color: rgba(255,255,255,0.5)">
          <Star />
        </el-icon>
        {{ data.counts.bookmark }}
      </span>
    </div>
    <!--    标签-->
    <div class="card-line">
      <el-tag v-for="item in data.tags"
              :type="item.toLowerCase().startsWith('r-18')?'danger':''"
              effect="dark"
              size="small"
              style="margin-right: 3px;margin-bottom: 3px"
      >
        <copy-span :text="item" />
      </el-tag>
    </div>
    <el-divider />
  </div>
</template>

<script>
import NovelLink from "@/components/v2/novel/novel-link";
import CopySpan from "@/components/v2/copy/copy-span";
import {Star} from "@element-plus/icons-vue";
import NovelBookmarkButton from "@/components/v2/novel/novel-bookmark-button";

const name = "小说系列正文卡片"

export default {
  name: "novel-series-content-card",
  data() {
    return {}
  },
  components: {NovelBookmarkButton, CopySpan, NovelLink, Star},
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object},
  },
}

</script>

<style scoped>
.card-info {
  margin-right: 10px;
}

.card-line {
  margin-bottom: 8px;
}
</style>