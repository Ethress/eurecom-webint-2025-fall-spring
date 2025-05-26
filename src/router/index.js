import { createRouter, createWebHistory } from 'vue-router'
import Home    from '../views/Home.vue'
import About   from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Map from '../views/Map.vue'
import Browse from '../views/Browse.vue'
import Login from '../views/Login.vue'
import ArticleDetail from '../views/ArticleDetail.vue'

//Vue.use(Router)

const routes = [
  { path: '/',      name: 'Home',    component: Home },
  { path: '/about', name: 'About',   component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/map', name: 'Map', component: Map },
  { path: '/browse', name: 'Browse', component: Browse },
  { path: '/login', name: 'Login', component: Login },
  { 
      path: '/article/:id', 
      name: 'article', 
      component: ArticleDetail, 
      props: true 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
