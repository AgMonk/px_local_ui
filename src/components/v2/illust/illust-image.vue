<template>
  <div v-loading="loading" :style="{
    display: 'inline-block',
    position:'relative',
    width: `${size}px`,
    height: `${size}px`,
  }"
  >
    <!--图片-->
    <illust-link :disable-tooltip="true" :pid="info.id">
      <el-image v-if="data.url && info.showImage"
                :src="data.url.replace('https://i.pximg.net','/pximg')"
                style="border-radius:15px"
                @error="failed"
                @load="success"
      />
    </illust-link>
    <!--r-18g标记-->
    <el-tag v-if="data.r18g" effect="dark" style="position: absolute; top: 0; left: 0;padding: 0 2px;" type="danger">R-18G</el-tag>
    <!--r-18标记-->
    <el-tag v-else-if="data.r18" effect="dark" style="position: absolute; top: 0; left: 0;padding: 0 2px;" type="danger">R-18</el-tag>

    <!--      收藏按钮-->
    <span v-if="data.illustType===2" :style=" {
      bottom:size/3+'px' ,
      right: size/3+'px',
      'border-radius':'15px'
    }"
          class="b1"
    >
      <illust-link :disable-tooltip="true" :pid="info.id">
        <el-icon :size="size/3" color="white">
          <CaretRight />
        </el-icon>
      </illust-link>
    </span>
    <!--      收藏按钮-->
    <span class="b1" style="bottom:0 ; right: 0;border-radius:15px">
      <illust-bookmark-button :pid="info.id" @illust-bookmark-success="$emit('illust-bookmark-success',$event)" />
    </span>
    <!--      图片数量-->
    <el-tag v-if="data.pageCount && data.pageCount>1" effect="dark" style="position: absolute; top:0 ; right: 0;border-radius:15px">
      {{ data.pageCount }}
    </el-tag>
  </div>
</template>

<script>
import IllustBookmarkButton from "@/components/v2/illust/illust-bookmark-button";
import IllustLink from "@/components/v2/illust/illust-link";
import {mapGetters} from "vuex";
import {CaretRight} from "@element-plus/icons-vue";

export default {
  name: "illust-image",
  components: {IllustLink, IllustBookmarkButton, CaretRight},
  data() {
    return {
      loading: true,
      errorCount: 0,
      data: {},
    }
  },
  emits: ['failed', 'success', "illust-bookmark-success"],
  computed: {},
  methods: {
    ...mapGetters("Illust", ['getIllust']),
    failed(e) {
      console.error(e)
      if (this.errorCount < 3) {
        //自动重试
        this.errorCount++;
        console.warn(`图片加载失败 pid = ${this.data.id} ,自动重试 第 ${this.errorCount} 次`)
        let url = this.data.url
        this.data.url = ""
        this.$nextTick(() => {
          this.data.url = url;
        })
      } else {
        //放弃加载
        this.loading = false;
      }
      this.$emit("failed", this.data.id)
    },
    success() {
      this.loading = false;
      this.$emit("success", this.data.id)
    },
    load(info) {
      this.loading = true;
      this.data = this.getIllust()(info.id)
    }
  },
  mounted() {
    this.load(this.info)
  },
  watch: {
    info(to) {
      this.load(to)
    }
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      default: 150,
    },
  },
}

</script>

<style scoped>
.b1 {
  background-color: rgba(61, 24, 24, 0.34);
  position: absolute;
}
</style>