import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//импорт модулей store
import posts from './posts'
import question from './question'
import comments from './comments'
import replies from './replies'

export default new Vuex.Store({
  modules: {
    posts,
    comments,
    question,
    replies
  }
})
