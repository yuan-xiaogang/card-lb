import Vue from 'vue';



// 清除样式
import '@/assets/css/base.scss';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import App from '@/App.vue';

import router from './router';
import './directives';

import axios from './axios'
import { AxiosStatic } from 'axios'
import OSS from 'ali-oss';

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosStatic
  }
}
Vue.prototype.$axios = axios

const client = new OSS({
  region: 'http://oss-cn-hangzhou.aliyuncs.com',
  accessKeyId: 'ZNrCcGVKMR7fIry1',
  accessKeySecret: 'j5KPlUXTzO4oiBX83aWMdfXcYmQYTP',
  bucket: 'lvboyuan-card'
});

Vue.prototype.$oss = client




Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#pcApp');