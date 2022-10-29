<template>
  <el-sub-menu v-if="route&&route.children" :index="route.path">
    <template #title><span @click="$router.push(route.path)">{{ route.name }}</span></template>
    <my-navi-item v-for="(child,i) in route.children" :key="i" :route="child " />
  </el-sub-menu>
  <el-menu-item v-else-if="route" :index="route.path">
    {{ route.name }}
  </el-menu-item>
</template>

<script>
export default {
  name: "my-navi-item",
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    key: {
      type: String,
    },
    route: {
      type: Object,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>