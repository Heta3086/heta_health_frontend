<template>
  <div class="max-w-5xl mx-auto px-4 py-16">
    <!-- BMI Summary -->
    <div v-if="foodStore.bmi" class="bg-green-600 rounded-3xl shadow-xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-2 text-center md:text-left">
        <h2 class="text-3xl font-bold">Your Health Profile</h2>
        <p class="text-green-100">Based on your body metrics and diet: <span class="font-bold capitalize">{{ foodStore.user?.dietType }}</span></p>
      </div>
      
      <div class="flex gap-8">
        <div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center min-w-[140px]">
          <div class="text-sm text-green-100 uppercase font-bold tracking-wider mb-1">BMI</div>
          <div class="text-4xl font-extrabold">{{ foodStore.bmi }}</div>
        </div>
        <div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center min-w-[140px]">
          <div class="text-sm text-green-100 uppercase font-bold tracking-wider mb-1">Category</div>
          <div class="text-2xl font-extrabold">{{ foodStore.bmiCategory }}</div>
        </div>
      </div>
    </div>

    <!-- Meals List -->
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900 flex items-center">
          <UtensilsCrossed class="w-6 h-6 mr-3 text-green-600" />
          Recommended Meals
        </h3>
        <span class="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
          {{ foodStore.meals.length }} Meals Found
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="foodStore.loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="bg-gray-100 animate-pulse rounded-2xl h-24 w-full"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="foodStore.meals.length === 0" class="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <SearchX class="w-8 h-8" />
        </div>
        <h4 class="text-xl font-bold text-gray-900 mb-2">No meals found</h4>
        <p class="text-gray-500 mb-8">Try adjusting your diet or allergy preferences.</p>
        <router-link to="/form" class="text-green-600 font-bold hover:underline">Go back to form</router-link>
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="divide-y divide-gray-100">
          <div 
            v-for="meal in foodStore.meals" 
            :key="meal.id"
            @click="viewDetails(meal)"
            class="group p-6 hover:bg-green-50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div class="flex items-center space-x-6">
              <!-- Small Thumbnail -->
              <div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                <img 
                  :src="`https://images.unsplash.com/${meal.imageSeed}?auto=format&fit=crop&w=200&q=80`" 
                  :alt="meal.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerpolicy="no-referrer"
                />
              </div>
              
              <div class="space-y-1">
                <div class="flex items-center space-x-3">
                  <h4 class="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{{ meal.name }}</h4>
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {{ meal.type }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">Perfectly balanced for your {{ foodStore.bmiCategory }} profile.</p>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-8">
              <div class="flex items-center space-x-8">
                <div class="text-center">
                  <div class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Calories</div>
                  <div class="text-sm font-bold text-gray-700">{{ meal.calories }} kcal</div>
                </div>
                <div class="text-center">
                  <div class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Protein</div>
                  <div class="text-sm font-bold text-gray-700">{{ meal.protein }}g</div>
                </div>
                <div class="text-center hidden md:block">
                  <div class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Carbs</div>
                  <div class="text-sm font-bold text-gray-700">{{ meal.carbs }}g</div>
                </div>
              </div>
              
              <div class="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                <ChevronRight class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { UtensilsCrossed, ChevronRight, SearchX } from 'lucide-vue-next';

const router = useRouter();
const foodStore = useFoodStore();

onMounted(() => {
  if (!foodStore.user) {
    router.push('/form');
  }
});

const viewDetails = (meal) => {
  foodStore.setSelectedMeal(meal);
  router.push(`/meal/${meal.id}`);
};
</script>
