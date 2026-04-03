<template>
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="rounded-[2rem] bg-gradient-to-br from-green-600 to-emerald-500 text-white p-8 md:p-12 shadow-2xl shadow-green-100">
      <div class="max-w-3xl space-y-4">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-green-100">Dashboard</p>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight">Welcome back, {{ displayName }}</h1>
        <p class="text-green-50 text-lg leading-relaxed">
          Every healthy choice you make today builds a stronger, happier you tomorrow.
        </p>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <router-link to="/profile" class="inline-flex items-center px-5 py-3 rounded-xl bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors">
          {{ profileButtonLabel }}
        </router-link>
        <router-link to="/meals" class="inline-flex items-center px-5 py-3 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/15 transition-colors">
          View Meals
        </router-link>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mt-8">
      <div class="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <p class="text-sm uppercase tracking-widest text-gray-400 font-bold">Login Status</p>
        <p class="mt-3 text-2xl font-black text-gray-900">{{ auth.isLoggedIn ? 'Logged in' : 'Logged out' }}</p>
      </div>
      <div class="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <p class="text-sm uppercase tracking-widest text-gray-400 font-bold">BMI</p>
        <p class="mt-3 text-2xl font-black text-gray-900">{{ food.bmi || 'Not set yet' }}</p>
      </div>
      <div class="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <p class="text-sm uppercase tracking-widest text-gray-400 font-bold">Meals Loaded</p>
        <p class="mt-3 text-2xl font-black text-gray-900">{{ food.meals.length }}</p>
      </div>
    </div>

    <div class="mt-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Your Recommendations</h2>
        <router-link to="/meals" class="text-green-600 font-semibold hover:text-green-700">Open meal list</router-link>
      </div>

      <div v-if="food.meals.length === 0" class="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
        Finish your profile to generate personalized meals from the database.
      </div>

      <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <article v-for="meal in food.meals.slice(0, 3)" :key="meal.id" class="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <img :src="meal.imageSeed?.startsWith('http') ? meal.imageSeed : `https://images.unsplash.com/${meal.imageSeed}?auto=format&fit=crop&w=800&q=80`" :alt="meal.name" class="h-48 w-full object-cover" referrerpolicy="no-referrer" @error="handleImageError" />
          <div class="p-5 space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-green-600 font-bold">{{ meal.type }}</p>
            <h3 class="text-xl font-bold text-gray-900">{{ meal.name }}</h3>
            <p class="text-sm text-gray-500">{{ meal.calories }} kcal · {{ meal.protein }}g protein</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authstore'
import { useFoodStore } from '../stores/useFoodStore'

const auth = useAuthStore()
const food = useFoodStore()

onMounted(async () => {
  auth.loadUser()
  food.hydrateProfileContext()

  if (food.user && food.bmiCategory) {
    await food.fetchMeals()
  }
})

const displayName = computed(() => auth.userName || 'Champion')
const profileButtonLabel = computed(() => {
  const completed = localStorage.getItem(`profileCompleted:${auth.userId}`) === 'true'
  return completed ? 'Your Profile' : 'Complete Profile'
})

const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
}
</script>