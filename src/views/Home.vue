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

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
    console.log(getScreenInfo())
    getIllustInfo(96599037)
  }
}
</script>
