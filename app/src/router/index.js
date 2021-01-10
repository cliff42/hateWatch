import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Bots from '../views/Bots.vue'
import Comments from '../views/Comments.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bots',
    name: 'Bots',
    component: Bots
  },
  {
    path: '/comments',
    name: 'Comments',
    component: Comments
  },
]

const router = new VueRouter({
  routes
})

export default router
