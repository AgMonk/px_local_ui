<template>
  <el-tooltip placement="right">
    <router-link :to="{name:'用户主页',params:{uid}}">
      <el-link :style="{'font-size':size+'px'}" :underline="false" type="primary">
        {{ data && data.name }}
      </el-link>
    </router-link>
    <template #content>
      <el-form>
        <el-form-item label="Uid">
          <copy-span :text="uid" />
        </el-form-item>
        <el-form-item label="官方">
          <el-link :href="`https://www.pixiv.net/users/${uid}/artworks`" target="_blank" type="primary">
            官方地址
          </el-link>
        </el-form-item>
      </el-form>
    </template>
  </el-tooltip>

</template>

<script>
import CopySpan from "@/components/v2/copy/copy-span";
import {mapGetters} from "vuex";

export default {
  name: "user-link",
  components: {CopySpan},
  data() {
    return {
      data: {}
    }
  },
  computed: {},
  methods: {
    ...mapGetters("User", ['getUser']),
    load(uid) {
      this.data = this.getUser()(uid)
    }
  },
  mounted() {
    this.load(this.uid)
  },
  watch: {
    uid(to) {
      this.load(to)
    }
  },
  props: {
    uid: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 15,
    },
  },
}

</script>

<style scoped>

</style>