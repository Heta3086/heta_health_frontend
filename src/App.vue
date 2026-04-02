<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="bg-green-500 p-2 rounded-lg">
              <Leaf class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-green-800 tracking-tight">HealthyFoodAdvisor</span>
          </router-link>
          
          <div class="hidden md:flex space-x-8">
            <router-link to="/" class="text-gray-600 hover:text-green-600 font-medium transition-colors">Home</router-link>
            <router-link to="/form" class="text-gray-600 hover:text-green-600 font-medium transition-colors">Get Started</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-green-50 border-t border-green-100 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="flex justify-center items-center space-x-2 mb-4">
          <Leaf class="w-6 h-6 text-green-600" />
          <span class="text-xl font-bold text-green-800">HealthyFoodAdvisor</span>
        </div>
        <p class="text-green-700/60 text-sm">© 2026 Healthy Food Advisor. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Leaf } from 'lucide-vue-next';
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body {
  background-color: white;
}
</style>
