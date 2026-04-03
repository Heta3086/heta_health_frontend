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

const TYPE_IMAGE_SEEDS = {
	breakfast: 'photo-1490645935967-10de6ba17061',
	lunch: 'photo-1512621776951-a57141f2eefd',
	dinner: 'photo-1543353071-10c8ba85a904',
	snack: 'photo-1482049016688-2d3e1b311543',
	dessert: 'photo-1488477181946-6428a0291777'
}

const KEYWORD_IMAGE_SEEDS = [
  { keyword: 'chicken', seed: 'photo-1604908176997-4313ccf2b6b0' },
  { keyword: 'fish', seed: 'photo-1519708227418-c8fd9a32b7a2' },
  { keyword: 'egg', seed: 'photo-1482049016688-2d3e1b311543' },
  { keyword: 'prawn', seed: 'photo-1559847844-5315695dadae' },
  { keyword: 'rice', seed: 'photo-1516684732162-798a0062be99' },
  { keyword: 'salad', seed: 'photo-1512621776951-a57141f2eefd' },
  { keyword: 'soup', seed: 'photo-1547592166-23ac45744acd' },
  { keyword: 'paratha', seed: 'photo-1505253758473-96b7015fcd40' },
  { keyword: 'wrap', seed: 'photo-1509722747041-616f39b57569' },
  { keyword: 'curry', seed: 'photo-1585937421612-70a008356fbe' },
  { keyword: 'omelette', seed: 'photo-1482049016688-2d3e1b311543' }
]

const RECIPE_IMAGE_SEEDS = {
	'peanut butter banana smoothie': 'photo-1505252585461-04db1eb84625',
	'paneer paratha': 'photo-1505253758473-96b7015fcd40',
	'panner paratha': 'photo-1505253758473-96b7015fcd40',
	'chicken rice bowl': 'photo-1512058564366-18510be2db19',
	'dry fruit milkshake': 'photo-1547592180-85f173990554',
	'egg bhurji': 'photo-1482049016688-2d3e1b311543',
	'vegetable upma': 'photo-1498837167922-ddd27525d352',
	'dal rice': 'photo-1546833999-b9f581a1996d',
	'grilled chicken salad': 'photo-1512621776951-a57141f2eefd',
	'vegetable khichdi': 'photo-1484723091739-30a097e8f929',
	'oats porridge': 'photo-1517673400267-0251440c45dc',
	'quinoa salad': 'photo-1512621776951-a57141f2eefd',
	'boiled eggs': 'photo-1482049016688-2d3e1b311543',
	'grilled fish': 'photo-1519708227418-c8fd9a32b7a2',
	'vegetable soup': 'photo-1547592166-23ac45744acd',
	'sprouts salad': 'photo-1512621776951-a57141f2eefd',
	'chickpea salad': 'photo-1512621776951-a57141f2eefd',
	'chicken stir fry': 'photo-1603366615917-1fa6dad5c4d1',
	'vegetable omelette': 'photo-1490645935967-10de6ba17061',
	'lentil soup': 'photo-1547592166-23ac45744acd',
	'yogurt fruit bowl': 'photo-1619566636858-adf3ef46400b',
	'tofu stir fry': 'photo-1528735602780-2552fd46c7af',
	'shrimp salad': 'photo-1504674900247-0877df9cc836',
	'corn salad': 'photo-1512621776951-a57141f2eefd',
	'sesame noodles': 'photo-1512058564366-18510be2db19',
	'soybean curry': 'photo-1585937421612-70a008356fbe',
	'lactose free smoothie': 'photo-1505252585461-04db1eb84625',
	'grilled prawns': 'photo-1559847844-5315695dadae',
	'tofu salad': 'photo-1528735602780-2552fd46c7af',
	'corn soup': 'photo-1547592166-23ac45744acd',
	'sesame toast': 'photo-1547592180-85f173990554',
	'mushroom soup': 'photo-1547592166-23ac45744acd',
	'cold coffee': 'photo-1495474472287-4d71bcdd2085',
	'spicy paneer wrap': 'photo-1509722747041-616f39b57569',
	'garlic chicken': 'photo-1604908176997-4313ccf2b6b0',
	'onion paratha': 'photo-1505253758473-96b7015fcd40',
	'tomato egg curry': 'photo-1490645935967-10de6ba17061',
	'banana pancakes': 'photo-1547592180-85f173990554',
	'chocolate oats': 'photo-1517673400267-0251440c45dc',
	'lemon rice': 'photo-1517248135467-4c7edcad34c4',
	'avocado salad': 'photo-1512621776951-a57141f2eefd',
	'chicken tandoori': 'photo-1603366615917-1fa6dad5c4d1',
	'egg mayo wrap': 'photo-1509722747041-616f39b57569',
	'baked fish with herbs': 'photo-1519708227418-c8fd9a32b7a2',
	'egg white scramble': 'photo-1490645935967-10de6ba17061',
	'chicken keema': 'photo-1604908176997-4313ccf2b6b0',
	'masala omelette': 'photo-1482049016688-2d3e1b311543',
	'butter chicken': 'photo-1603366615917-1fa6dad5c4d1',
	'egg stuffed paratha': 'photo-1505253758473-96b7015fcd40',
	'chicken caesar salad': 'photo-1512621776951-a57141f2eefd',
	'boiled egg salad': 'photo-1512621776951-a57141f2eefd',
	'fish curry': 'photo-1519708227418-c8fd9a32b7a2',
	'chicken soup': 'photo-1547592166-23ac45744acd',
	'prawn masala': 'photo-1559847844-5315695dadae',
	'egg fried rice': 'photo-1512058564366-18510be2db19',
	'chicken omelette': 'photo-1482049016688-2d3e1b311543'
}

const DEFAULT_MEAL_IMAGE_SEED = 'photo-1546069901-ba9599a7e63c'

const buildMealSearchImageUrl = (meal) => {
	const searchTerms = [
		meal?.name,
		meal?.type,
		Array.isArray(meal?.ingredients) ? meal.ingredients.map((item) => item?.name).join(' ') : ''
	]
		.filter(Boolean)
		.join(' ')
		.trim()

	const query = encodeURIComponent(searchTerms || 'healthy food')
	return `https://source.unsplash.com/featured/600x400/?${query}`
}

const getCurrentAuthUserId = () => {
	const raw = localStorage.getItem('userId')
	return raw ? String(raw) : ''
}

const scopedKey = (key, authUserId = getCurrentAuthUserId()) => {
	return authUserId ? `${key}:${authUserId}` : key
}

const getMealImageSeed = (meal) => {
	if (!meal) return DEFAULT_MEAL_IMAGE_SEED

	if (meal.imageSeed) return meal.imageSeed
	if (meal.image_seed) return meal.image_seed

	const mealName = String(meal.name || '').trim().toLowerCase()
	if (mealName && RECIPE_IMAGE_SEEDS[mealName]) {
		return RECIPE_IMAGE_SEEDS[mealName]
	}

	const searchableText = [
		meal.name,
		meal.type,
		Array.isArray(meal.ingredients) ? meal.ingredients.map((item) => item?.name).join(' ') : ''
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase()

	for (const item of KEYWORD_IMAGE_SEEDS) {
		if (searchableText.includes(item.keyword)) {
			return item.seed
		}
	}

	const mealType = String(meal.type || '').toLowerCase()
	for (const [key, seed] of Object.entries(TYPE_IMAGE_SEEDS)) {
		if (mealType.includes(key)) {
			return seed
		}
	}

	return buildMealSearchImageUrl(meal) || DEFAULT_MEAL_IMAGE_SEED
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
	imageSeed: getMealImageSeed(meal)
})

const getStoredProfileUserId = () => {
	const raw = localStorage.getItem(scopedKey('profileUserId'))
	if (!raw) return null

	const parsed = Number(raw)
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const getStoredNumber = (key) => {
	const raw = localStorage.getItem(scopedKey(key))
	if (!raw) return null

	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : null
}

const getStoredArray = (key) => {
	const raw = localStorage.getItem(scopedKey(key))
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
		favoritesLoaded: false,
		selectedMeal: null,
		loading: false,
		error: null
	}),

	actions: {
		resetAccountState() {
			this.user = null
			this.bmi = null
			this.bmiCategory = null
			this.meals = []
			this.favorites = []
			this.favoritesLoaded = false
			this.weeklyPlanner = getEmptyPlanner()
			this.profileUserId = null
			this.selectedMeal = null
			this.loading = false
			this.error = null
		},

		hydrateProfileContext() {
			const authUserId = getCurrentAuthUserId()

			if (!this.user) {
				const profileRaw = localStorage.getItem(scopedKey('userProfile', authUserId))
				if (profileRaw) {
					try {
						this.user = JSON.parse(profileRaw)
					} catch (error) {
						console.error('Failed to parse stored profile', error)
					}
				} else {
					this.user = null
				}
			}

			if (!this.bmi) {
				this.bmi = getStoredNumber('userBmi')
			} else if (!localStorage.getItem(scopedKey('userBmi', authUserId))) {
				this.bmi = null
			}

			if (!this.bmiCategory) {
				this.bmiCategory = localStorage.getItem(scopedKey('userBmiCategory', authUserId)) || null
			} else if (!localStorage.getItem(scopedKey('userBmiCategory', authUserId))) {
				this.bmiCategory = null
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

		resolveAuthUserId(userId) {
			const candidate = userId ?? getCurrentAuthUserId()
			const parsed = Number(candidate)
			return Number.isFinite(parsed) && parsed > 0 ? parsed : null
		},

		async fetchPlanner(userId) {
			const resolvedUserId = this.resolveAuthUserId(userId)
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
					localStorage.setItem(scopedKey('profileUserId'), String(response.data.user_id))
				}

				this.bmi = response.data.bmi
				this.bmiCategory = response.data.category
				const authUserId = getCurrentAuthUserId()
				localStorage.setItem(scopedKey('profileCompleted', authUserId), 'true')
				localStorage.setItem(scopedKey('userProfile', authUserId), JSON.stringify(payload))
				localStorage.setItem(scopedKey('userBmi', authUserId), String(response.data.bmi ?? ''))
				localStorage.setItem(scopedKey('userBmiCategory', authUserId), response.data.category ?? '')

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
					imageSeed: getMealImageSeed({
						name: meal.name,
						type: meal.meal_type,
						ingredients: meal.ingredients,
						imageSeed: meal.imageSeed,
						image_seed: meal.image_seed
					})
				}))

				localStorage.setItem(scopedKey('userMeals'), JSON.stringify(this.meals))
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
					imageSeed: getMealImageSeed({
						name: mealData.name,
						type: mealData.meal_type,
						ingredients: payload.ingredients,
						imageSeed: mealData.imageSeed,
						image_seed: mealData.image_seed
					})
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

		async fetchFavorites(userId) {
			const resolvedUserId = this.resolveAuthUserId(userId)
			if (!resolvedUserId) return

			this.loading = true
			this.error = null

			try {
				const response = await api.get(`/favorites/${resolvedUserId}`)
				this.favorites = (response.data || []).map((item) => {
					const cachedMeal = this.meals.find((meal) => meal.id === item.id)
					return cachedMeal || {
						id: item.id,
						name: item.name,
						type: item.meal_type || 'Favorite',
						calories: item.calories ?? 0,
						protein: item.protein ?? 0,
						carbs: item.carbs ?? 0,
						fats: item.fats ?? 0,
						ingredients: item.ingredients ?? [],
						recipe: item.recipes ?? [],
						imageSeed: getMealImageSeed(item)
					}
				})
				this.favoritesLoaded = true
				localStorage.setItem(scopedKey('favorites'), JSON.stringify(this.favorites))
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to fetch favorites'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async addFavorite(meal, userId) {
			const resolvedUserId = this.resolveAuthUserId(userId)
			if (!resolvedUserId || !meal?.id) return

			if (this.isFavorite(meal.id)) return

			this.loading = true
			this.error = null

			try {
				await api.post('/favorites', {
					user_id: resolvedUserId,
					meal_id: meal.id
				})

				this.favorites.push(normalizeMeal(meal))
				localStorage.setItem(scopedKey('favorites'), JSON.stringify(this.favorites))
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to add favorite'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		async removeFavorite(meal, userId) {
			const resolvedUserId = this.resolveAuthUserId(userId)
			if (!resolvedUserId || !meal?.id) return

			this.loading = true
			this.error = null

			try {
				await api.delete('/favorites', {
					data: {
						user_id: resolvedUserId,
						meal_id: meal.id
					}
				})

				this.favorites = this.favorites.filter((favoriteMeal) => favoriteMeal.id !== meal.id)
				localStorage.setItem(scopedKey('favorites'), JSON.stringify(this.favorites))
			} catch (err) {
				this.error = err?.response?.data?.error || 'Failed to remove favorite'
				console.error(err)
			} finally {
				this.loading = false
			}
		},

		toggleFavorite(meal) {
			return this.isFavorite(meal.id) ? this.removeFavorite(meal) : this.addFavorite(meal)
		},

		isFavorite(mealId) {
			return this.favorites.some((favoriteMeal) => favoriteMeal.id === mealId)
		},

		async addToPlanner(day, meal, userId) {
			const normalizedDay = normalizeDay(day)
			if (!normalizedDay || !Object.prototype.hasOwnProperty.call(this.weeklyPlanner, normalizedDay)) return
			const resolvedUserId = this.resolveAuthUserId(userId)
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
			const resolvedUserId = this.resolveAuthUserId(userId)
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