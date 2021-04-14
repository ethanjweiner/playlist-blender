import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blend from '../views/Blend.vue'
import PostMerge from '../views/PostMerge.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blend',
    name: 'Blend',
    component: Blend
  },
  {
    path: '/post-blend',
    name: 'Post Blend',
    component: PostMerge
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: PrivacyPolicy
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
