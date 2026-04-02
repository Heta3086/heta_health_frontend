import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import FormView from '@/views/FormView.vue';
import MealsListView from '@/views/MealsListView.vue';
import MealDetailView from '@/views/MealDetailView.vue';
import BmiAnalysisView from '@/views/BmiAnalysisView.vue';
import DietCustomizationView from '@/views/DietCustomizationView.vue';
import AllergySafeView from '@/views/AllergySafeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/form',
      name: 'form',
      component: FormView
    },
    {
      path: '/meals',
      name: 'meals',
      component: MealsListView
    },
    {
      path: '/meal/:id',
      name: 'meal-detail',
      component: MealDetailView,
      props: true
    },
    {
      path: '/bmi-analysis',
      name: 'bmi-analysis',
      component: BmiAnalysisView
    },
    {
      path: '/diet-customization',
      name: 'diet-customization',
      component: DietCustomizationView
    },
    {
      path: '/allergy-safe',
      name: 'allergy-safe',
      component: AllergySafeView
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
