<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-white border border-green-100 rounded-3xl p-8 sm:p-10 shadow-sm">
      <p class="text-sm font-semibold tracking-wide uppercase text-green-700">Personal Nutrition</p>
      <h1 class="mt-3 text-4xl font-extrabold text-gray-900">Diet Customization</h1>
      <p class="mt-4 text-gray-600 leading-relaxed">
        Build a meal plan that matches your goals and eating style. Choose vegetarian, vegan, non-vegetarian,
        and more while keeping nutrition balanced.
      </p>

      <div class="mt-8 grid sm:grid-cols-3 gap-4">
        <div class="rounded-2xl p-5 border border-green-100 bg-green-50">
          <h2 class="font-bold text-gray-900">Goal Based</h2>
          <p class="mt-2 text-sm text-gray-700">Weight loss, maintenance, or muscle gain meal structures.</p>
        </div>
        <div class="rounded-2xl p-5 border border-green-100 bg-lime-50">
          <h2 class="font-bold text-gray-900">Preference Based</h2>
          <p class="mt-2 text-sm text-gray-700">Vegetarian, vegan, high-protein, and flexible choices.</p>
        </div>
        <div class="rounded-2xl p-5 border border-green-100 bg-emerald-50">
          <h2 class="font-bold text-gray-900">Practical Plans</h2>
          <p class="mt-2 text-sm text-gray-700">Simple meals with realistic prep and portion guidance.</p>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap gap-3">
        <router-link
          to="/form"
          class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Customize My Diet
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
