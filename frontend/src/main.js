import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import socket from './services/socket-service'
import Utils from './utils'

Utils.parseLocationParams();

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(socket);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
