<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {getScreenInfo} from "@/assets/js/utils/ScreenUtils";
import {getIllustInfo} from "@/assets/js/request/illust";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
    setTitle("首页")
    console.log(getScreenInfo())
  }
}
</script>
