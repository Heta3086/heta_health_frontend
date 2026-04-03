<template>
  <div class="max-w-5xl mx-auto px-4 py-16">
    <div v-if="foodStore.bmi" class="bg-green-600 rounded-3xl shadow-xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-2 text-center md:text-left">
        <h2 class="text-3xl font-bold">Your Health Profile</h2>
        <p class="text-green-100">Based on your body metrics and diet: <span class="font-bold capitalize">{{ foodStore.user?.dietType || foodStore.user?.diet }}</span></p>
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

      <div v-if="foodStore.loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-gray-100 animate-pulse rounded-3xl h-96"></div>
      </div>

      <div v-else-if="foodStore.meals.length === 0" class="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <SearchX class="w-8 h-8" />
        </div>
        <h4 class="text-xl font-bold text-gray-900 mb-2">No meals found</h4>
        <p class="text-gray-500 mb-8">Try adjusting your diet or allergy preferences.</p>
        <router-link to="/" class="text-green-600 font-bold hover:underline">Go back home</router-link>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="meal in foodStore.meals"
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
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ meal.type }}
              </span>
            </div>
            <div class="absolute top-4 right-4 flex flex-col gap-2">
              <button
                @click.stop="toggleFavorite(meal)"
                class="p-2 rounded-full backdrop-blur-md transition-all shadow-sm"
                :class="foodStore.isFavorite(meal.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'"
              >
                <Heart class="w-5 h-5" :class="{ 'fill-current': foodStore.isFavorite(meal.id) }" />
              </button>
              <button
                @click.stop="openPlannerModal(meal)"
                class="p-2 bg-white/90 backdrop-blur-md text-gray-400 hover:text-green-600 rounded-full transition-all shadow-sm"
              >
                <CalendarPlus class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="p-6 flex-grow space-y-4">
            <h4 class="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{{ meal.name }}</h4>

            <div class="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
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
              class="w-full py-3 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center group/btn"
            >
              View Details
              <ArrowRight class="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
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
        <p class="text-gray-500 mb-6">Select a day to add <span class="font-bold text-green-600">{{ mealToPlan?.name }}</span> to your weekly schedule.</p>
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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { useAuthStore } from '@/stores/authstore';
import { UtensilsCrossed, ArrowRight, SearchX, Heart, CalendarPlus, X, Plus } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();
const authStore = useAuthStore();
const showPlannerModal = ref(false);
const mealToPlan = ref(null);
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const targetPlannerDay = ref('');

const normalizeDay = (day) => {
  if (!day) return '';

  const normalized = String(day).trim().toLowerCase();
  const dayMap = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return dayMap[normalized] || '';
};

onMounted(async () => {
  authStore.loadUser();
  foodStore.hydrateProfileContext();

  targetPlannerDay.value = normalizeDay(route.query.plannerDay || localStorage.getItem('pendingPlannerDay'));
  if (targetPlannerDay.value) {
    localStorage.setItem('pendingPlannerDay', targetPlannerDay.value);
  } else {
    localStorage.removeItem('pendingPlannerDay');
  }

  if (!foodStore.user || !foodStore.bmiCategory) {
    router.push('/profile');
    return;
  }

  await foodStore.fetchMeals();
});

const viewDetails = (meal) => {
  foodStore.setSelectedMeal(meal);
  router.push(`/meal/${meal.id}`);
};

const toggleFavorite = async (meal) => {
  if (foodStore.isFavorite(meal.id)) {
    await foodStore.removeFavorite(meal, authStore.userId);
    return;
  }

  await foodStore.addFavorite(meal, authStore.userId);
};

const openPlannerModal = (meal) => {
  mealToPlan.value = meal;

  if (targetPlannerDay.value) {
    planMeal(targetPlannerDay.value);
    return;
  }

  showPlannerModal.value = true;
};

const planMeal = async (day) => {
  await foodStore.addToPlanner(day, mealToPlan.value, authStore.userId);
  showPlannerModal.value = false;
  mealToPlan.value = null;

  if (targetPlannerDay.value) {
    localStorage.removeItem('pendingPlannerDay');
    targetPlannerDay.value = '';
    router.push('/planner');
  }
};
</script>
