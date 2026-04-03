<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authstore'
import { useFoodStore } from '@/stores/useFoodStore'
import { UserPlus } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref('')

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match'
    return
  }

  localError.value = ''

  try {
    await auth.signup({
      name: name.value,
      email: email.value,
      password: password.value
    })

    useFoodStore().resetAccountState()
    auth.clearSession()
    router.push('/login')
  } catch (error) {
    console.error('Signup failed', error)
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
          <UserPlus class="h-8 w-8" />
        </div>
        <h2 class="text-3xl font-black text-gray-900">Create Account</h2>
        <p class="mt-2 text-gray-500 font-medium">Join us and start your healthy journey</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-bold text-gray-700 mb-2">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>
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
          <div>
            <label for="confirmPassword" class="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <p v-if="localError" class="text-sm font-medium text-red-600">
          {{ localError }}
        </p>

        <p v-if="auth.error" class="text-sm font-medium text-red-600">
          {{ auth.error }}
        </p>

        <div>
          <button
            type="submit"
            :disabled="auth.loading"
            class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {{ auth.loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </div>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          Already have an account?
          <router-link to="/login" class="font-bold text-green-600 hover:text-green-700">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>