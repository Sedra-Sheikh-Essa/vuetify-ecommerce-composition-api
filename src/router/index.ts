import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CartView from '@/views/CartView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // Lazy loading: تحميل الصفحة فقط عند زيارتها
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product-details',
      component: () => import('@/views/ProductDetailView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
  ],
})

export default router
