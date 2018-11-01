import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Users from '@/views/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
     name:'login',
     path:'/login',
     component: Login
    },
    {
      name:'home',
      path:'/home',
      component: Home,
      children:[
        {
        name: 'users',
        path:'/users',
        component:Users
      }
      ]
     }
  ]
})
