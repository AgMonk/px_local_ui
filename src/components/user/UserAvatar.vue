<template>
  <el-avatar :size="size" :src="src" @error="src=empty"/>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "UserAvatar",
  data() {
    return {
      src:"",
      empty:"https://s.pximg.net/common/images/no_profile_s.png",
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
    ...mapState("User",[`cache`]),
  },
  methods: {
    load(uid){
      const key = `${uid}`
      if (this.cache.hasOwnProperty(key)){
        this.src = this.config.domain+this.cache[key].avatar
      }else{
        this.src = this.empty;
      }
    }
  },
  mounted() {
    this.load(this.uid)
  },
  watch: {
    uid(to){
      this.load(to)
    }
  },
  props: {
    uid:{
      type:Number,
      required: true,
    },
    size:{
      type:Number,
      default:60,
    },

  },
}

</script>

<style scoped>

</style>