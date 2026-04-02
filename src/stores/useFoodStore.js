import { defineStore } from 'pinia'
import axios from 'axios'

export const useFoodStore = defineStore('food', {
  state: () => ({
    user: null,
    bmi: null,
    bmiCategory: null,
    meals: [],
    selectedMeal: null,
    loading: false,
    error: null
  }),

  actions: {
    async submitUserForm(userData) {
      this.loading = true
      this.error = null

      try {
        this.user = userData

        // Backend expects `diet`, while the form stores it as `dietType`.
        const payload = {
          ...userData,
          diet: userData.dietType
        }

        const response = await axios.post(
          'http://localhost:8080/user',
          payload
        )

        this.bmi = response.data.bmi
        this.bmiCategory = response.data.category

        await this.fetchMeals()

      } catch (err) {
        this.error = 'Failed to submit user data'
        console.error(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMeals() {
      if (!this.user || !this.bmiCategory) return

      this.loading = true

      try {
        const response = await axios.get(
          'http://localhost:8080/meals',
          {
            params: {
              diet: this.user.dietType,
              bmi: this.bmiCategory,
              allergies: this.user.allergies?.join(',') || ''
            }
          }
        )

        // Normalize backend response keys to the structure used in Vue components.
        this.meals = (response.data || []).map((meal) => ({
          id: meal.id,
          name: meal.name,
          type: meal.meal_type,
          calories: meal.nutrition?.calories ?? 0,
          protein: meal.nutrition?.protein ?? 0,
          carbs: meal.nutrition?.carbs ?? 0,
          fats: meal.nutrition?.fats ?? 0,
          ingredients: meal.ingredients ?? [],
          recipe: (meal.recipes ?? []).map((step) => step.instruction),
          imageSeed: meal.imageSeed || 'photo-1546069901-ba9599a7e63c'
        }))

      } catch (err) {
        this.error = 'Failed to fetch meals'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    setSelectedMeal(meal) {
      this.selectedMeal = meal
    }
  }
})
