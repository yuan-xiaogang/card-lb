import Vue from 'vue';
import Router from 'vue-router';
import Home from '@appViews/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/card',
      name: 'card',
      component: () => import('@appViews/card.vue'),
    },
  ],
});
