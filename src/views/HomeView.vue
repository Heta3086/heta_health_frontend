<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <Sparkles class="w-4 h-4 mr-2" />
            Your Personal Health Companion
          </div>
          <h1 class="text-6xl font-extrabold text-gray-900 leading-tight">
            Healthy Food <span class="text-green-600">Advisor</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-lg">
            Get personalized healthy meals based on your body and diet. Start your journey to a better you today.
          </p>
          <div class="flex space-x-4">
            <router-link to="/signup" class="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center group">
              Get Started
              <ArrowRight class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </router-link>
            <router-link to="/login" class="px-8 py-4 bg-white text-green-600 border-2 border-green-100 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all">
              Login
            </router-link>
          </div>
          
          <div class="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ statsLoading ? '...' : stats.recipeCount.toLocaleString() }}</div>
              <div class="text-sm text-gray-500">Healthy Recipes</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ statsLoading ? '...' : stats.userCount.toLocaleString() }}</div>
              <div class="text-sm text-gray-500">Happy Users</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">100%</div>
              <div class="text-sm text-gray-500">Personalized</div>
            </div>
          </div>

          <p v-if="statsError" class="text-sm text-red-500">{{ statsError }}</p>
        </div>
        
        <div class="relative">
          <div class="absolute -top-20 -right-20 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"></div>
          <div class="absolute -bottom-20 -left-20 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
          <img 
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" 
            alt="Healthy Food" 
            class="relative rounded-3xl shadow-2xl z-10 w-full aspect-square object-cover"
            referrerpolicy="no-referrer"
          />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-green-50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
          <p class="text-green-700/60 mt-4">We provide science-backed meal recommendations.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <component :is="feature.icon" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ArrowRight, Sparkles, Activity, Utensils, ShieldCheck } from 'lucide-vue-next';

const stats = reactive({
  recipeCount: 0,
  userCount: 0,
  mealCount: 0
});
const statsLoading = ref(true);
const statsError = ref('');

onMounted(async () => {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Failed to load homepage stats');
    }

    const data = await response.json();
    stats.recipeCount = Number(data.recipeCount) || 0;
    stats.userCount = Number(data.userCount) || 0;
    stats.mealCount = Number(data.mealCount) || 0;
  } catch (error) {
    statsError.value = 'Live stats are unavailable right now.';
    console.error(error);
  } finally {
    statsLoading.value = false;
  }
});

const features = [
  {
    title: 'BMI Analysis',
    description: 'We calculate your BMI to understand your body needs and provide appropriate calorie targets.',
    icon: Activity
  },
  {
    title: 'Diet Customization',
    description: 'Whether you are vegan, vegetarian, or non-vegetarian, we have the perfect meal plan for you.',
    icon: Utensils
  },
  {
    title: 'Allergy Safe',
    description: 'Your safety is our priority. We filter out any ingredients you are allergic to.',
    icon: ShieldCheck
  }
];
</script>
