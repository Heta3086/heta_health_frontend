<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="flex items-center justify-between mb-12">
      <div class="space-y-2">
        <h2 class="text-4xl font-black text-gray-900">Weekly Planner</h2>
        <p class="text-gray-500 text-lg">Your personalized meal schedule for the week.</p>
      </div>
      <div class="bg-green-50 px-6 py-3 rounded-2xl border border-green-100 flex items-center space-x-3">
        <Calendar class="w-6 h-6 text-green-600" />
        <span class="text-green-700 font-bold">Week of April 2</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
      <div
        v-for="(meal, day) in foodStore.weeklyPlanner"
        :key="day"
        class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group"
        :class="{ 'border-green-200 bg-green-50/30': meal }"
      >
        <div class="p-5 border-b border-gray-50 flex items-center justify-between">
          <span class="font-black text-gray-900 uppercase tracking-widest text-xs">{{ day }}</span>
          <div v-if="meal" class="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>

        <div class="flex-grow p-4 min-h-[280px] flex flex-col">
          <div v-if="meal" class="space-y-4 flex flex-col h-full">
            <div class="relative h-32 rounded-2xl overflow-hidden shadow-sm">
              <img
                :src="`https://images.unsplash.com/${meal.imageSeed}?auto=format&fit=crop&w=400&q=80`"
                :alt="meal.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerpolicy="no-referrer"
              />
              <button
                @click="removeMeal(day)"
                class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="space-y-2 flex-grow">
              <h4 class="font-bold text-gray-900 text-sm leading-tight group-hover:text-green-600 transition-colors">{{ meal.name }}</h4>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{{ meal.type }}</span>
                <span class="text-[10px] text-gray-400 font-bold">{{ meal.calories }} kcal</span>
              </div>
            </div>
            <button
              @click="viewDetails(meal)"
              class="w-full py-2 bg-white text-green-600 border border-green-100 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all"
            >
              View Recipe
            </button>
          </div>

          <div v-else class="flex-grow flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-100 rounded-2xl p-6 bg-gray-50/50 group-hover:border-green-200 transition-colors">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-300 group-hover:text-green-400 transition-colors">
              <Plus class="w-6 h-6" />
            </div>
            <router-link to="/meals" class="text-xs font-bold text-gray-400 hover:text-green-600 transition-colors uppercase tracking-widest">
              Add Meal
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authstore';
import { useFoodStore } from '@/stores/useFoodStore';
import { Calendar, Plus, X } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const foodStore = useFoodStore();

onMounted(async () => {
  authStore.loadUser();
  await foodStore.fetchPlanner(authStore.userId);
});

const viewDetails = (meal) => {
  foodStore.setSelectedMeal(meal);
  router.push(`/meal/${meal.id}`);
};

const removeMeal = async (day) => {
  await foodStore.removeFromPlanner(day, authStore.userId);
};
</script>