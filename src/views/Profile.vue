<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="rounded-[2rem] bg-white border border-green-100 shadow-xl overflow-hidden">
      <div class="bg-gradient-to-br from-green-600 to-emerald-500 p-8 md:p-10 text-white">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-green-100">Profile Setup</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">{{ profileCompleted ? 'Edit Your Health Profile' : 'Complete Your Health Profile' }}</h1>
        <p class="mt-3 text-green-50 text-lg">
          Add your details once and get meal recommendations that truly match your body and goals.
        </p>
      </div>

      <form @submit.prevent="submitProfile" class="p-8 md:p-10 space-y-8">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your full name"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Age</label>
            <input
              v-model.number="form.age"
              type="number"
              required
              min="18"
              max="120"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="18+"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Gender</label>
            <select
              v-model="form.gender"
              required
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Diet Type</label>
            <p v-if="dietOptions.length === 0" class="text-xs font-medium text-amber-700">No dietary options found in database.</p>
            <select
              v-model="form.dietType"
              required
              :disabled="dietOptions.length === 0"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option v-for="diet in dietOptions" :key="diet.value" :value="diet.value">{{ diet.label }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Height (cm)</label>
            <input
              v-model.number="form.height"
              type="number"
              required
              min="50"
              max="250"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="175"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Weight (kg)</label>
            <input
              v-model.number="form.weight"
              type="number"
              required
              min="20"
              max="300"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="70"
            />
          </div>
        </div>

        <div>
          <label class="text-sm font-bold text-gray-600 uppercase tracking-wider">Allergies</label>
          <p class="mt-2 text-sm text-gray-500">Select allergies so meal recommendations can avoid these ingredients.</p>

          <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label
              v-for="option in allergyOptions"
              :key="option"
              class="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <input
                :checked="form.allergies.includes(option)"
                type="checkbox"
                class="h-4 w-4 accent-green-600"
                @change="toggleAllergy(option)"
              />
              <span class="text-sm font-semibold text-gray-800 capitalize">{{ option }}</span>
            </label>
          </div>
        </div>

        <p v-if="food.error" class="text-sm font-medium text-red-600">{{ food.error }}</p>

        <div class="flex flex-wrap gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving profile...' : (profileCompleted ? 'Update Profile' : 'Save & Generate Plan') }}
          </button>
          <router-link
            to="/dashboard"
            class="inline-flex items-center px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authstore'
import { useFoodStore } from '../stores/useFoodStore'

const auth = useAuthStore()
const food = useFoodStore()
const router = useRouter()
const loading = ref(false)
const profileCompleted = ref(false)

const form = ref({
  name: '',
  age: null,
  gender: '',
  height: null,
  weight: null,
  dietType: 'veg',
  allergies: []
})

const fallbackAllergyOptions = ['dairy', 'peanuts', 'gluten', 'eggs', 'soy', 'shellfish', 'sesame']

const allergyOptions = computed(() => {
  const dbOptions = (food.allergies || [])
    .map((item) => item?.name)
    .filter(Boolean)

  return dbOptions.length > 0 ? dbOptions : fallbackAllergyOptions
})

const dietOptions = computed(() => {
  return food.dietOptions || []
})

const toggleAllergy = (option) => {
  if (form.value.allergies.includes(option)) {
    form.value.allergies = form.value.allergies.filter((item) => item !== option)
    return
  }

  form.value.allergies.push(option)
}

onMounted(async () => {
  auth.loadUser()

  if (food.allergies.length === 0) {
    await food.fetchAllergies()
  }

  if (food.dietOptions.length === 0) {
    await food.fetchDietOptions()
  }

  const profileKey = `userProfile:${auth.userId}`
  const completedKey = `profileCompleted:${auth.userId}`
  const storedProfileRaw = localStorage.getItem(profileKey)
  const hasStoredProfile = localStorage.getItem(completedKey) === 'true'
  profileCompleted.value = hasStoredProfile

  if (food.user) {
    form.value = {
      name: food.user.name || '',
      age: food.user.age || null,
      gender: food.user.gender || '',
      height: food.user.height || null,
      weight: food.user.weight || null,
      dietType: food.user.dietType || food.user.diet || 'veg',
      allergies: food.user.allergies || []
    }
    return
  }

  if (!storedProfileRaw) return

  try {
    const storedProfile = JSON.parse(storedProfileRaw)
    form.value = {
      name: storedProfile.name || '',
      age: storedProfile.age || null,
      gender: storedProfile.gender || '',
      height: storedProfile.height || null,
      weight: storedProfile.weight || null,
      dietType: storedProfile.dietType || storedProfile.diet || 'veg',
      allergies: storedProfile.allergies || []
    }
  } catch (error) {
    console.error('Failed to parse stored profile', error)
  }

  if (!dietOptions.value.some((diet) => diet.value === form.value.dietType) && dietOptions.value.length > 0) {
    form.value.dietType = dietOptions.value[0].value
  }
})

const submitProfile = async () => {
  if (dietOptions.value.length === 0) {
    food.error = 'No dietary options available from database'
    return
  }

  loading.value = true
  food.error = null

  try {
    const profilePayload = {
      ...form.value,
      allergies: form.value.allergies,
      auth_user_id: auth.userId
    }

    await food.submitUserForm(profilePayload)

    localStorage.setItem(`profileCompleted:${auth.userId}`, 'true')
    localStorage.setItem(`userProfile:${auth.userId}`, JSON.stringify(profilePayload))
    profileCompleted.value = true

    router.push('/bmi-analysis')
  } catch (error) {
    console.error('Profile submission failed', error)
  } finally {
    loading.value = false
  }
}
</script>
