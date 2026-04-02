<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-white border border-green-100 rounded-3xl p-8 sm:p-10 shadow-sm">
      <p class="text-sm font-semibold tracking-wide uppercase text-green-700">Health Insight</p>
      <h1 class="mt-3 text-4xl font-extrabold text-gray-900">BMI Analysis</h1>
      <p class="mt-4 text-gray-600 leading-relaxed">
        Body Mass Index (BMI) helps estimate whether your weight is in a healthy range for your height.
        We use this as one signal to personalize calories and meal balance.
      </p>

      <div class="mt-8 grid sm:grid-cols-2 gap-6">
        <div class="rounded-2xl bg-green-50 p-6 border border-green-100">
          <h2 class="text-lg font-bold text-gray-900">How We Use BMI</h2>
          <ul class="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Estimate healthy weight range</li>
            <li>Set personalized calorie targets</li>
            <li>Adjust meal recommendations over time</li>
          </ul>
        </div>

        <div class="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
          <h2 class="text-lg font-bold text-gray-900">Formula</h2>
          <p class="mt-3 text-sm text-gray-700">
            BMI = weight (kg) / [height (m)]²
          </p>
          <p class="mt-2 text-sm text-gray-700">
            This is a starting point and should be combined with lifestyle and medical context.
          </p>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap gap-3">
        <router-link
          to="/form"
          class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Start Personal Plan
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
