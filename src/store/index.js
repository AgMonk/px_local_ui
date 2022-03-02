import { createStore } from 'vuex'
import Config from "@/store/Config";
import Artworks from "@/store/Artworks";
import Aria2 from "@/store/Aria2";
import Loading from "@/store/Loading";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Config,Artworks,Aria2,Loading
  }
})
