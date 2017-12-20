// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Dialog from '../dqd.dialog/dqd.dialog.js'
Vue.use(VueRouter);
Vue.use(Dialog);
import Index from './components/Index'
import Paper from './components/Paper'
import VueResource from 'vue-resource'
Vue.use(VueResource);
if (process.env.NODE_ENV === "development") {
  globalParams.apiDomain = '';
}
Vue.http.options.root = globalParams.apiDomain
Vue.http.headers.common['UUID'] = globalParams.UUID
if (globalParams.Authorization) {
  Vue.http.headers.common['Authorization'] = globalParams.Authorization
}

function getQueryString(name) {
  var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)",
    "i"));
  if (result == null || result.length < 1) {
    return "";
  }
  return result[1];
}
var paper = getQueryString("paper");
var mobile = getQueryString("mobile")
if (paper) {
  location.href += '#/paper?mobile=' + mobile;
}

Vue.mixin({
  created: function() {
    this.is_dqd_app = navigator.userAgent.toLowerCase().match(
      /NewsApp\/([\d\.]+)/i);
    this.id = getQueryString("id");
  },
  methods: {}
});

const router = new VueRouter({
  routes: [{
    path: '/',
    name: 'home',
    component: Index
  }, {
    path: '/paper',
    name: 'paper',
    component: Paper
  }]
})
router.afterEach(function(router) {
    //when page change dialog still show,make all dialogs hide;
    let _dialogs = document.querySelectorAll(".dialog")
    for (let i = 0, len = _dialogs.length; i < len; i++) {
      _dialogs[i].style.display = "none";
    }
  })
  /* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
