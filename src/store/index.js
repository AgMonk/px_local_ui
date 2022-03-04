import {createStore} from 'vuex'
import Config from "@/store/Config";
import Artworks from "@/store/Artworks";
import Aria2 from "@/store/Aria2";
import Loading from "@/store/Loading";
import User from "@/store/User";
import FollowLatest from "@/store/FollowLatest";
import Search from "@/store/Search";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Config, Artworks, Aria2, Loading, User, FollowLatest, Search
  }
})
