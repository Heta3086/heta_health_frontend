<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authstore'
import { LogIn } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value
    })

    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed', error)
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
          <LogIn class="h-8 w-8" />
        </div>
        <h2 class="text-3xl font-black text-gray-900">Welcome Back</h2>
        <p class="mt-2 text-gray-500 font-medium">Login to access your health dashboard</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <p v-if="auth.error" class="text-sm font-medium text-red-600">
          {{ auth.error }}
        </p>

        <div>
          <button
            type="submit"
            :disabled="auth.loading"
            class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {{ auth.loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          Don't have an account?
          <router-link to="/signup" class="font-bold text-green-600 hover:text-green-700">Sign up for free</router-link>
        </p>
      </div>
    </div>
  </div>
</template>