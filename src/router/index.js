import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authstore'

// Public Pages
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import FormView from '@/views/FormView.vue'

// Protected Flow Pages
import Dashboard from '@/views/Dashboard.vue'
import ProfileView from '@/views/Profile.vue'
import MealsListView from '@/views/MealsListView.vue'
import MealDetailView from '@/views/MealDetailView.vue'
import BmiAnalysisView from '@/views/BmiAnalysisView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import PlannerView from '@/views/PlannerView.vue'

// Optional Features
import DietCustomizationView from '@/views/DietCustomizationView.vue'
import AllergySafeView from '@/views/AllergySafeView.vue'

// ❗ Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 🏠 HOME
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    // 🔐 AUTH
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/form',
      name: 'form',
      component: FormView,
      meta: { requiresAuth: true }
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },

    // 👤 PROFILE (after login)
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },

    // 📊 BMI RESULT (optional page)
    {
      path: '/bmi-analysis',
      name: 'bmi-analysis',
      component: BmiAnalysisView,
      meta: { requiresAuth: true }
    },

    // 🍱 DASHBOARD (MEALS)
    {
      path: '/meals',
      name: 'meals',
      component: MealsListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/planner',
      name: 'planner',
      component: PlannerView,
      meta: { requiresAuth: true }
    },

    // 🍽 MEAL DETAIL
    {
      path: '/meal/:id',
      name: 'meal-detail',
      component: MealDetailView,
      props: true,
      meta: { requiresAuth: true }
    },

    // 🧠 OPTIONAL FEATURES
    {
      path: '/diet-customization',
      name: 'diet-customization',
      component: DietCustomizationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/allergy-safe',
      name: 'allergy-safe',
      component: AllergySafeView,
      meta: { requiresAuth: true }
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})



//  🔐 ROUTE GUARD (VERY IMPORTANT 🔥)

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // load user from localStorage
  auth.loadUser()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router