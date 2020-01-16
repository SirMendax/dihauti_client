window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.post['crossDomain'] = true;
const jwt = `Bearer ${localStorage.getItem('token')}`;
window.axios.defaults.headers.common['Authorization'] = jwt;

import Echo from 'laravel-echo';
window.io = require('socket.io-client');

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: 'https://api.dihauti.ru',
  auth:{
    headers:{
      Authorization: jwt,
    }
  }
});

import Vue from 'vue'

//Auth system
import Auth from "./helper/Auth";
Vue.use(Auth);

//Style
import "./assets/scss/index.scss"
import "aos/dist/aos.css";
//Animate move elements
import AOS from "aos";

//Sweetalert
window.swal = require('sweetalert2');

//Editor
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';

//Router and Vuex
import router from './router'
import store from './store'


//Directives
import scrollEvent from './directive/scroll.js'
import inputMask from './directive/mask.js'
Vue.directive('scroll', scrollEvent);
Vue.directive('mask', inputMask);

let VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo, {
  container: "body",
  duration: 700,
  easing: "ease",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

Vue.directive('clipscroll', {
  inserted: function(el, binding) {
    let f = function() {
      var hasRun = false;
      var classIn = binding.value.classIn;
      if (!hasRun && window.scrollY > binding.value.start) {
        hasRun = true;
        el.classList.add(classIn);
        el.style.opacity = '1';
      }
      if(window.scrollY > binding.value.end){
        window.removeEventListener('scroll', f)
      }
    };
    window.addEventListener('scroll', f);
  }
});


//Component registration
import App from './App.vue'

import Header from './components/Header';
Vue.component('v-header', Header);
import Footer from './components/Footer';
Vue.component('v-footer', Footer);
import Like from './components/Like';
Vue.component('v-like', Like);
import Pagination from './components/Pagination';
Vue.component('v-pagination', Pagination);
import Role from './components/Role';
Vue.component('v-role', Role);
//Vue config
Vue.config.productionTip = false;

window.EventBus = new Vue();

new Vue({
  created() {
    AOS.init()
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
