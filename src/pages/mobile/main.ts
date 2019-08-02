import Vue from 'vue';
import App from '@/App.vue';
import router from './router';
// import '@/registerServiceWorker';
// 清除样式
import '@/assets/css/base.scss';

import axios from '@/config/axios.ts'
import { AxiosStatic } from 'axios'



declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosStatic
  }
}
Vue.prototype.$axios = axios

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
