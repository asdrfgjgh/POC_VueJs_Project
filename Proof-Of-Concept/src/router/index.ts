import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ModulesPage from '../views/ModulesPage.vue'
import UserTagsPage from '../views/UserTagsPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import FavoritesPage from '@/views/FavoritesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage

    },
    {
      path: '/modules',
      name: 'modules',
      component: ModulesPage
    },
    {
      path: '/user-tags',
      name: 'user-tags',
      component: FavoritesPage
    },
        {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
        {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: UserTagsPage,
      meta: { requiresAuth: true }
    }
  ]
});

export default router;