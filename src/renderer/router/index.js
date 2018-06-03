import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/Index').default
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/systeminfo',
      name: 'landing-page',
      component: require('@/components/_temp/LandingPage').default
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
