import { defineStore } from 'pinia'
import axios from 'axios'

const DAY_MAP = {
	'monday': 'Monday',
	'tuesday': 'Tuesday',
	'wednesday': 'Wednesday',
	'thursday': 'Thursday',
	'friday': 'Friday',
	'saturday': 'Saturday',
	'sunday': 'Sunday'
}

const getEmptyPlanner = () => ({
	Monday: null,
	Tuesday: null,
	Wednesday: null,
	Thursday: null,
	Friday: null,
	Saturday: null,
	Sunday: null
})

const normalizeDay = (day) => {
	if (!day) return null
	return DAY_MAP[String(day).trim().toLowerCase()] || null
}

const normalizeMeal = (meal) => ({
	id: meal.id,
	name: meal.name,
	type: meal.type,
	calories: meal.calories ?? 0,
	imageSeed: meal.imageSeed || 'photo-1546069901-ba9599a7e63c'
})

const getStoredProfileUserId = () => {
	const raw = localStorage.getItem('profileUserId')
	if (!raw) return null

	const parsed = Number(raw)
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const getStoredNumber = (key) => {
	const raw = localStorage.getItem(key)
	if (!raw) return null

	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : null
}

const getStoredArray = (key) => {
	const raw = localStorage.getItem(key)
	if (!raw) return []

	try {
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch (error) {
		console.error(`Failed to parse stored ${key}`, error)
		return []
	}
}

const api = axios.create({
	baseURL: '/api'
})

export const useFoodStore = defineStore('food', {
	state: () => ({
		user: null,
		bmi: null,
		bmiCategory: null,
		meals: [],
		allergies: [],
		dietOptions: [],
		favorites: [],
		weeklyPlanner: getEmptyPlanner(),
		profileUserId: getStoredProfileUserId(),
		selectedMeal: null,
		loading: false,
		error: null
	}),

	actions: {
		hydrateProfileContext() {
			if (!this.user) {
				const profileRaw = localStorage.getItem('userProfile')
				if (profileRaw) {
					try {
						this.user = JSON.parse(profileRaw)
					} catch (error) {
						console.error('Failed to parse stored profile', error)
					}
				}
			}

			if (!this.bmi) {
				this.bmi = getStoredNumber('userBmi')
			}

			if (!this.bmiCategory) {
				this.bmiCategory = localStorage.getItem('userBmiCategory') || null
			}

			if (!this.profileUserId) {
				this.profileUserId = getStoredProfileUserId()
			}

			if (!Array.isArray(this.meals) || this.meals.length === 0) {
				this.meals = getStoredArray('userMeals')
			}
		},

		resolvePlannerUserId(authUserId) {
			this.hydrateProfileContext()

			if (this.profileUserId && this.profileUserId > 0) {
				return this.profileUserId
			}

			const storedProfileId = getStoredProfileUserId()
			if (storedProfileId) {
				this.profileUserId = storedProfileId
				return storedProfileId
			}

			const parsedAuthId = Number(authUserId)
			return Number.isFinite(parsedAuthId) && parsedAuthId > 0 ? parsedAuthId : null
		},

		async fetchPlanner(userId) {
			const resolvedUserId = this.resolvePlannerUserId(userId)
			if (!resolvedUserId) return

			this.loading = true
			this.error = null

			try {
				const response = await api.get(`/planner/${resolvedUserId}`)
				const emptyPlanner = getEmptyPlanner()

				for (const entry of response.data || []) {
					const day = normalizeDay(entry?.day)
					const meal = entry?.meal
					if (!day || !meal) {
						continue
					}

					emptyPlanner[day] = normalizeMeal(meal)
				}

				this.weeklyPlanner = emptyPlanner
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to fetch planner'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async fetchDietOptions() {
			this.loading = true
			this.error = null

			try {
				const response = await api.get('/diet-options')
				this.dietOptions = (response.data || []).map((item) => ({
					value: item.value,
					label: item.label
				}))
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to fetch diet options'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async fetchAllergies() {
			this.loading = true
			this.error = null

			try {
				const response = await api.get('/allergies')
				this.allergies = (response.data || []).map((item) => ({
					id: item.id,
					name: item.name
				}))
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to fetch allergies'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async submitUserForm(userData) {
			this.loading = true
			this.error = null

			try {
				this.user = userData

				const payload = {
					...userData,
					diet: userData.dietType ?? userData.diet
				}

				const response = await api.post('/user', payload)

				if (response?.data?.user_id) {
					this.profileUserId = response.data.user_id
					localStorage.setItem('profileUserId', String(response.data.user_id))
				}

				this.bmi = response.data.bmi
				this.bmiCategory = response.data.category
				localStorage.setItem('profileCompleted', 'true')
				localStorage.setItem('userProfile', JSON.stringify(payload))
				localStorage.setItem('userBmi', String(response.data.bmi ?? ''))
				localStorage.setItem('userBmiCategory', response.data.category ?? '')

				await this.fetchMeals()
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to submit user data'
				console.error(err)
				throw err
			} finally {
				this.loading = false
			}
		},

		async fetchMeals() {
			this.hydrateProfileContext()

			if (!this.user || !this.bmiCategory) return

			this.loading = true

			try {
				const response = await api.get('/meals', {
					params: {
						diet: this.user.dietType ?? this.user.diet,
						bmi: this.bmiCategory,
						allergies: this.user.allergies?.join(',') || ''
					}
				})

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

				localStorage.setItem('userMeals', JSON.stringify(this.meals))
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to fetch meals'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async fetchMealById(mealId) {
			const parsedMealId = Number(mealId)
			if (!Number.isFinite(parsedMealId) || parsedMealId <= 0) {
				this.error = 'Invalid meal id'
				return null
			}

			const cachedMeal = this.meals.find((meal) => meal.id === parsedMealId)
			if (cachedMeal) {
				this.selectedMeal = cachedMeal
				return cachedMeal
			}

			this.loading = true
			this.error = null

			try {
				const response = await api.get(`/meals/${parsedMealId}`)
				const payload = response?.data || {}
				const mealData = payload.meal || {}
				const nutrition = payload.nutrition || {}

				const fullMeal = {
					id: mealData.id,
					name: mealData.name,
					type: mealData.meal_type,
					calories: nutrition.calories ?? 0,
					protein: nutrition.protein ?? 0,
					carbs: nutrition.carbs ?? 0,
					fats: nutrition.fats ?? 0,
					ingredients: payload.ingredients ?? [],
					recipe: (payload.recipes ?? []).map((step) => step.instruction),
					imageSeed: 'photo-1546069901-ba9599a7e63c'
				}

				this.selectedMeal = fullMeal
				return fullMeal
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to fetch meal details'
				console.error(err)
				return null
			} finally {
				this.loading = false
			}
		},

		setSelectedMeal(meal) {
			if (!meal) {
				this.selectedMeal = null
				return
			}

			const mealId = Number(meal.id)
			const cachedMeal = this.meals.find((item) => item.id === mealId)

			if (cachedMeal) {
				this.selectedMeal = cachedMeal
				return
			}

			this.selectedMeal = {
				...meal,
				id: mealId,
				ingredients: meal.ingredients ?? [],
				recipe: meal.recipe ?? []
			}
		},

		toggleFavorite(meal) {
			const existingIndex = this.favorites.findIndex((favoriteMeal) => favoriteMeal.id === meal.id)

			if (existingIndex >= 0) {
				this.favorites.splice(existingIndex, 1)
				return
			}

			this.favorites.push(meal)
		},

		isFavorite(mealId) {
			return this.favorites.some((favoriteMeal) => favoriteMeal.id === mealId)
		},

		async addToPlanner(day, meal, userId) {
			const normalizedDay = normalizeDay(day)
			if (!normalizedDay || !Object.prototype.hasOwnProperty.call(this.weeklyPlanner, normalizedDay)) return
			const resolvedUserId = this.resolvePlannerUserId(userId)
			if (!resolvedUserId || !meal?.id) return

			this.loading = true
			this.error = null

			try {
				await api.post('/planner', {
					user_id: resolvedUserId,
					meal_id: meal.id,
					day: normalizedDay
				})

				this.weeklyPlanner[normalizedDay] = normalizeMeal(meal)
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to add meal to planner'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async removeFromPlanner(day, userId) {
			const normalizedDay = normalizeDay(day)
			if (!normalizedDay || !Object.prototype.hasOwnProperty.call(this.weeklyPlanner, normalizedDay)) return
			const resolvedUserId = this.resolvePlannerUserId(userId)
			if (!resolvedUserId) return

			this.loading = true
			this.error = null

			try {
				await api.delete('/planner', {
					data: {
						user_id: resolvedUserId,
						day: normalizedDay
					}
				})

				this.weeklyPlanner[normalizedDay] = null
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to remove meal from planner'
				console.error(err)
			} finally {
				this.loading = false
			}
		}
	}
})

