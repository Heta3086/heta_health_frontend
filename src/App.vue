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
          
          <div class="hidden md:flex space-x-8 items-center">
            <router-link v-if="!auth.isLoggedIn" to="/" :class="navClass('/')">Home</router-link>
            <router-link v-if="auth.isLoggedIn" to="/profile" :class="navClass('/profile')">Profile</router-link>
            <router-link v-if="auth.isLoggedIn" to="/dashboard" :class="navClass('/dashboard')">Dashboard</router-link>
            <router-link v-if="auth.isLoggedIn" to="/favorites" :class="navClass('/favorites')">Favorites</router-link>
            <router-link v-if="auth.isLoggedIn" to="/planner" :class="navClass('/planner')">Planner</router-link>
            <router-link v-if="!auth.isLoggedIn" to="/login" :class="navClass('/login')">Login</router-link>
            <router-link v-if="!auth.isLoggedIn" to="/signup" :class="navClass('/signup')">Signup</router-link>
            <button v-else @click="openLogoutConfirm" class="font-semibold text-red-600 hover:text-red-700 transition-colors">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="showLogoutConfirm" class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-gray-100">
        <h3 class="text-2xl font-black text-gray-900">Confirm Logout</h3>
        <p class="mt-2 text-gray-600">Are you sure you want to log out from your account?</p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showLogoutConfirm = false" class="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button @click="confirmLogout" class="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
            Confirm Logout
          </button>
        </div>
      </div>
    </div>

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
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/authstore';
import { useFoodStore } from './stores/useFoodStore';
import { Leaf } from 'lucide-vue-next';

const auth = useAuthStore();
const food = useFoodStore();
const router = useRouter();
const route = useRoute();
const showLogoutConfirm = ref(false);
const hasCompletedProfile = ref(false);

const refreshProfileStatus = () => {
  hasCompletedProfile.value = localStorage.getItem('profileCompleted') === 'true' || !!food.profileUserId;
};

onMounted(() => {
  food.hydrateProfileContext();
  refreshProfileStatus();
});

watch(() => route.fullPath, () => {
  refreshProfileStatus();
});

watch(() => food.profileUserId, () => {
  refreshProfileStatus();
});

const baseNavClass = 'font-medium transition-colors';
const navClass = (path: string) => {
  const isActive = computed(() => route.path === path || route.path.startsWith(`${path}/`)).value;
  return isActive
    ? `${baseNavClass} text-green-700`
    : `${baseNavClass} text-gray-600 hover:text-green-600`;
};

const openLogoutConfirm = () => {
  showLogoutConfirm.value = true;
};

const confirmLogout = async () => {
  showLogoutConfirm.value = false;
  await auth.logout();
  hasCompletedProfile.value = false;
  router.push('/');
};
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
