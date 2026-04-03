<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-2xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center space-y-10 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>

      <div class="relative z-10 space-y-6">
        <div class="mx-auto w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mb-8">
          <Activity class="w-12 h-12" />
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-gray-500 uppercase tracking-widest">Your Result</h2>
          <div class="text-8xl font-black text-gray-900 leading-none">
            {{ foodStore.bmi }}
          </div>
          <div class="inline-flex px-6 py-2 bg-green-600 text-white rounded-full font-black text-xl uppercase tracking-wider">
            {{ foodStore.bmiCategory }}
          </div>
        </div>

        <div class="bg-green-50 rounded-[2rem] p-8 border border-green-100">
          <p class="text-2xl font-bold text-green-800 leading-relaxed">
            <span v-if="foodStore.bmiCategory === 'normal'">🎉 You are healthy!</span>
            <span v-else-if="foodStore.bmiCategory === 'underweight'">💪 Time to build some strength!</span>
            <span v-else-if="foodStore.bmiCategory === 'overweight'">🏃 Let's get moving!</span>
            <span v-else>🥗 Focus on balanced nutrition!</span>
          </p>
          <p class="text-green-700/60 mt-2 font-medium">
            We've curated a personalized meal plan just for you.
          </p>
        </div>

        <div class="pt-6 flex flex-wrap justify-center gap-3">
          <router-link
            to="/meals"
            class="inline-flex items-center px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl hover:scale-105"
          >
            View Meals
            <ArrowRight class="ml-3 w-6 h-6" />
          </router-link>
          <router-link
            to="/form"
            class="inline-flex items-center px-8 py-5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all"
          >
            Edit Form
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { Activity, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const foodStore = useFoodStore();

onMounted(() => {
  if (!foodStore.bmi) {
    router.push('/form');
  }
});
</script>
