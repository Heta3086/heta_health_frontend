<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-white border border-green-100 rounded-3xl p-8 sm:p-10 shadow-sm">
      <p class="text-sm font-semibold tracking-wide uppercase text-green-700">Food Safety</p>
      <h1 class="mt-3 text-4xl font-extrabold text-gray-900">Allergy Safe</h1>
      <p class="mt-4 text-gray-600 leading-relaxed">
        Your allergy profile filters meal suggestions automatically. We avoid ingredients you flag and guide
        you toward safer alternatives.
      </p>

      <div class="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 class="text-lg font-bold text-gray-900">Common Tracked Allergens</h2>
        <p class="mt-3 text-sm text-gray-700">
          These entries are loaded from your database using the allergy API.
        </p>

        <p v-if="loadingAllergies" class="mt-3 text-sm font-medium text-amber-700">Loading allergy data...</p>
        <p v-else-if="allergyError" class="mt-3 text-sm font-medium text-red-600">{{ allergyError }}</p>

        <div v-else-if="allergyNames.length > 0" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="name in allergyNames"
            :key="name"
            class="inline-flex items-center rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
          >
            {{ name }}
          </span>
        </div>
        <p v-else class="mt-3 text-sm text-gray-700">No allergy records found in the database.</p>
      </div>

      <div class="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6">
        <h2 class="text-lg font-bold text-gray-900">How It Works</h2>
        <ul class="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
          <li>Save your allergy and intolerance list</li>
          <li>We filter ingredients from meal recommendations</li>
          <li>You receive safer replacement options</li>
        </ul>
      </div>

      <div class="mt-10 flex flex-wrap gap-3">
        <router-link
          to="/form"
          class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Set Allergy Preferences
        </router-link>
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useFoodStore } from '@/stores/useFoodStore'

const foodStore = useFoodStore()
const loadingAllergies = ref(false)
const allergyError = ref('')

const allergyNames = computed(() =>
  (foodStore.allergies || [])
    .map((item) => item?.name)
    .filter(Boolean)
)

onMounted(async () => {
  loadingAllergies.value = true
  allergyError.value = ''

  try {
    await foodStore.fetchAllergies()
  } catch (err) {
    allergyError.value = 'Failed to load allergy data'
  } finally {
    loadingAllergies.value = false
  }
})
</script>
