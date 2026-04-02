<template>
  <div v-if="meal" class="max-w-5xl mx-auto px-4 py-16">
    <button 
      @click="router.back()" 
      class="mb-8 flex items-center text-green-600 font-bold hover:text-green-700 group"
    >
      <ChevronLeft class="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
      Back to Meals
    </button>

    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <!-- Left Column: Image & Nutrition -->
      <div class="space-y-8">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl">
          <img 
            :src="`https://images.unsplash.com/${meal.imageSeed}?auto=format&fit=crop&w=1200&q=80`" 
            :alt="meal.name"
            class="w-full aspect-[4/3] object-cover"
            referrerpolicy="no-referrer"
          />
          <div class="absolute top-6 left-6">
            <span class="px-4 py-2 bg-white/90 backdrop-blur-md text-green-700 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg">
              {{ meal.type }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity class="w-5 h-5 mr-3 text-green-600" />
            Nutrition Facts
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div v-for="(val, label) in nutrition" :key="label" class="text-center p-4 rounded-2xl bg-green-50/50">
              <div class="text-xs text-green-700/60 uppercase font-bold tracking-wider mb-1">{{ label }}</div>
              <div class="text-xl font-extrabold text-gray-900">{{ val }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Ingredients & Recipe -->
      <div class="space-y-8">
        <div class="space-y-2">
          <h1 class="text-4xl font-extrabold text-gray-900 leading-tight">{{ meal.name }}</h1>
          <p class="text-green-600 font-medium">A healthy choice for your {{ meal.type }}</p>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ShoppingBasket class="w-5 h-5 mr-3 text-green-600" />
            Ingredients
          </h3>
          <ul class="space-y-4">
            <li v-for="(ing, idx) in meal.ingredients" :key="idx" class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <span class="text-gray-700 font-medium">{{ ing.name }}</span>
              <span class="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-bold">{{ ing.quantity }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ChefHat class="w-5 h-5 mr-3 text-green-600" />
            Recipe Steps
          </h3>
          <ol class="space-y-6">
            <li v-for="(step, idx) in meal.recipe" :key="idx" class="flex gap-4">
              <div class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {{ idx + 1 }}
              </div>
              <p class="text-gray-600 leading-relaxed pt-1">{{ step }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="max-w-7xl mx-auto px-4 py-32 text-center">
    <div class="animate-pulse space-y-8">
      <div class="w-32 h-8 bg-gray-100 rounded-full mx-auto"></div>
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="w-full aspect-square bg-gray-100 rounded-3xl"></div>
        <div class="space-y-6">
          <div class="w-3/4 h-12 bg-gray-100 rounded-2xl"></div>
          <div class="w-full h-48 bg-gray-100 rounded-3xl"></div>
          <div class="w-full h-48 bg-gray-100 rounded-3xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { ChevronLeft, Activity, ShoppingBasket, ChefHat } from 'lucide-vue-next';

const router = useRouter();
const foodStore = useFoodStore();
const meal = computed(() => foodStore.selectedMeal);

const nutrition = computed(() => {
  if (!meal.value) return {};
  return {
    calories: `${meal.value.calories} kcal`,
    protein: `${meal.value.protein}g`,
    carbs: `${meal.value.carbs}g`,
    fats: `${meal.value.fats}g`
  };
});

onMounted(() => {
  if (!meal.value) {
    router.push('/meals');
  }
});
</script>
