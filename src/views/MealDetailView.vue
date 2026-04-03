<template>
  <div v-if="isLoadingMeal" class="max-w-4xl mx-auto px-4 py-20 text-center">
    <h2 class="text-2xl font-black text-gray-900">Loading meal details...</h2>
    <p class="mt-3 text-gray-500">Please wait while we prepare your recipe.</p>
  </div>

  <div v-else-if="meal" class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid lg:grid-cols-2 gap-16 items-start">
      <div class="space-y-8">
        <div class="relative rounded-[3rem] overflow-hidden shadow-2xl group">
          <img
            :src="`https://images.unsplash.com/${meal.imageSeed}?auto=format&fit=crop&w=1200&q=80`"
            :alt="meal.name"
            class="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
            referrerpolicy="no-referrer"
          />
          <div class="absolute top-6 right-6 flex flex-col gap-3">
            <button
              @click="toggleFavorite"
              class="p-4 rounded-2xl backdrop-blur-md transition-all shadow-lg"
              :class="foodStore.isFavorite(meal.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'"
            >
              <Heart class="w-6 h-6" :class="{ 'fill-current': foodStore.isFavorite(meal.id) }" />
            </button>
            <button
              @click="showPlannerModal = true"
              class="p-4 bg-white/90 backdrop-blur-md text-gray-400 hover:text-green-600 rounded-2xl transition-all shadow-lg"
            >
              <CalendarPlus class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-4xl font-black text-gray-900">{{ meal.name }}</h2>
            <span class="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-black uppercase tracking-widest">
              {{ meal.type }}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div class="bg-gray-50 rounded-3xl p-6 text-center space-y-1">
              <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Calories</div>
              <div class="text-2xl font-black text-gray-900">{{ meal.calories }}</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase">kcal</div>
            </div>
            <div class="bg-gray-50 rounded-3xl p-6 text-center space-y-1">
              <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Protein</div>
              <div class="text-2xl font-black text-gray-900">{{ meal.protein }}</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase">grams</div>
            </div>
            <div class="bg-gray-50 rounded-3xl p-6 text-center space-y-1">
              <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Carbs</div>
              <div class="text-2xl font-black text-gray-900">{{ meal.carbs }}</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase">grams</div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-gray-900 flex items-center">
              <ChefHat class="w-6 h-6 mr-3 text-green-600" />
              Ingredients
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="ing in meal.ingredients" :key="ing.name" class="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div class="font-bold text-gray-800 text-sm">{{ ing.name }}</div>
                  <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ ing.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10">
        <div class="flex items-center justify-between border-b border-gray-100 pb-6">
          <h3 class="text-2xl font-black text-gray-900">Cooking Steps</h3>
          <div class="flex items-center space-x-2 text-green-600 font-bold text-sm">
            <span>{{ currentStep + 1 }}</span>
            <span class="text-gray-300">/</span>
            <span>{{ meal.recipe.length }}</span>
          </div>
        </div>

        <div class="space-y-12">
          <div
            v-for="(step, index) in meal.recipe"
            :key="index"
            class="relative flex gap-8 group"
            :class="{ 'opacity-30': currentStep !== index }"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-lg"
                :class="currentStep === index ? 'bg-green-600 text-white scale-110' : 'bg-gray-100 text-gray-400'"
              >
                {{ index + 1 }}
              </div>
              <div v-if="index < meal.recipe.length - 1" class="w-1 h-full bg-gray-100 my-2 rounded-full"></div>
            </div>
            <div class="pt-2 pb-8 flex-1">
              <p class="text-lg font-medium text-gray-700 leading-relaxed">{{ step }}</p>
              <button
                v-if="currentStep === index && index < meal.recipe.length - 1"
                @click="currentStep++"
                class="mt-6 px-6 py-3 bg-green-50 text-green-600 rounded-xl font-bold text-sm hover:bg-green-600 hover:text-white transition-all flex items-center group/btn"
              >
                Next Step
                <ArrowRight class="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button
                v-if="currentStep === index && index === meal.recipe.length - 1"
                @click="router.push('/meals')"
                class="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center"
              >
                Recipe Completed!
                <CheckCircle2 class="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPlannerModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Add to Planner</h3>
          <button @click="showPlannerModal = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <p class="text-gray-500 mb-6">Select a day to add <span class="font-bold text-green-600">{{ meal.name }}</span> to your weekly schedule.</p>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="day in days"
            :key="day"
            @click="planMeal(day)"
            class="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-50 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <span class="font-bold text-gray-700 group-hover:text-green-700">{{ day }}</span>
            <Plus class="w-5 h-5 text-gray-300 group-hover:text-green-600" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="max-w-4xl mx-auto px-4 py-20 text-center">
    <h2 class="text-2xl font-black text-gray-900">Meal details not available</h2>
    <p class="mt-3 text-gray-500">This meal could not be loaded. Please pick another meal.</p>
    <button
      @click="router.push('/meals')"
      class="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all"
    >
      Back to Meals
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { useAuthStore } from '@/stores/authstore';
import { Heart, CalendarPlus, ChefHat, ArrowRight, CheckCircle2, X, Plus } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();
const authStore = useAuthStore();
const meal = computed(() => foodStore.selectedMeal);
const currentStep = ref(0);
const showPlannerModal = ref(false);
const isLoadingMeal = ref(false);
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const loadMealDetails = async () => {
  const routeMealId = Number(route.params.id);
  if (!Number.isFinite(routeMealId) || routeMealId <= 0) {
    router.push('/meals');
    return;
  }

  const hasSameMeal = meal.value && Number(meal.value.id) === routeMealId;
  const hasFullDetails = hasSameMeal && Array.isArray(meal.value.recipe) && Array.isArray(meal.value.ingredients);

  if (hasFullDetails) {
    return;
  }

  isLoadingMeal.value = true;
  await foodStore.fetchMealById(routeMealId);
  isLoadingMeal.value = false;
  currentStep.value = 0;

  if (!foodStore.selectedMeal) {
    router.push('/meals');
  }
};

onMounted(async () => {
  authStore.loadUser();
  await loadMealDetails();
});

const planMeal = async (day) => {
  await foodStore.addToPlanner(day, meal.value, authStore.userId);
  showPlannerModal.value = false;
};

const toggleFavorite = async () => {
  if (!meal.value) return;

  if (foodStore.isFavorite(meal.value.id)) {
    await foodStore.removeFavorite(meal.value, authStore.userId);
    return;
  }

  await foodStore.addFavorite(meal.value, authStore.userId);
};
</script>
