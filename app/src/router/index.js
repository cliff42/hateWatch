import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Bots from '../views/Bots.vue'
import Comments from '../views/Comments.vue'
import Trends from '../views/Trends.vue'

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
  {
    path: '/trends',
    name: 'Trends',
    component: Trends
  }
]

const router = new VueRouter({
  routes
})

export default router
