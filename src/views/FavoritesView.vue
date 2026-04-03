<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="flex items-center justify-between mb-12">
      <div class="space-y-2">
        <h2 class="text-4xl font-black text-gray-900">Your Favorites</h2>
        <p class="text-gray-500 text-lg">Meals you've saved for later.</p>
      </div>
      <div class="bg-red-50 px-6 py-3 rounded-2xl border border-red-100 flex items-center space-x-3">
        <Heart class="w-6 h-6 text-red-500 fill-current" />
        <span class="text-red-700 font-bold">{{ foodStore.favorites.length }} Saved</span>
      </div>
    </div>

    <div v-if="foodStore.favorites.length === 0" class="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-20 text-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
        <Heart class="w-10 h-10" />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
      <p class="text-gray-500 mb-8 max-w-sm mx-auto">Start exploring meals and save the ones you love to see them here.</p>
      <router-link to="/meals" class="inline-flex px-8 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
        Explore Meals
      </router-link>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="meal in foodStore.favorites"
        :key="meal.id"
        class="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col"
      >
        <div class="relative h-56 overflow-hidden">
          <img
            :src="`https://images.unsplash.com/${meal.imageSeed}?auto=format&fit=crop&w=600&q=80`"
            :alt="meal.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerpolicy="no-referrer"
          />
          <button
            @click.stop="foodStore.toggleFavorite(meal)"
            class="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md text-red-500 rounded-full transition-all shadow-sm hover:bg-red-500 hover:text-white"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 flex-grow space-y-4">
          <h4 class="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{{ meal.name }}</h4>

          <div class="flex items-center justify-between pt-4 border-t border-gray-50">
            <div class="flex items-center space-x-4">
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Calories</span>
                <span class="text-sm font-bold text-gray-700">{{ meal.calories }} kcal</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Protein</span>
                <span class="text-sm font-bold text-gray-700">{{ meal.protein }}g</span>
              </div>
            </div>

            <button
              @click="viewDetails(meal)"
              class="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
            >
              <ArrowRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { Heart, Trash2, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const foodStore = useFoodStore();

const viewDetails = (meal) => {
  foodStore.setSelectedMeal(meal);
  router.push(`/meal/${meal.id}`);
};
</script>