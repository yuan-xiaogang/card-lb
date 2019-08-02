import Vue from 'vue';
import Router from 'vue-router';
import Index from './views/pc.vue';
import menu from './menu';

Vue.use(Router);

const route = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/cardInfo',
      children: menu
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue')
    }
  ],
});

route.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    if (!sessionStorage.getItem('userToken')) {
      next('/login')
    }
  }
  next()
})


export default route