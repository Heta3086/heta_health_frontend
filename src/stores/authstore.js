import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(digest))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    userName: '',
    isLoggedIn: false,
    loading: false,
    error: null,
  }),

  actions: {

    async signup(data) {
      this.loading = true
      this.error = null

      try {
        const hashedPassword = await hashPassword(data.password)
        await api.post('/signup', {
          ...data,
          password: hashedPassword
        })
      } catch (error) {
        this.error = error?.response?.data?.error || 'Signup failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(data) {
      this.loading = true
      this.error = null

      try {
        const hashedPassword = await hashPassword(data.password)
        const res = await api.post('/login', {
          ...data,
          password: hashedPassword
        })

        this.userId = res.data.user_id
        this.userName = res.data.name || ''
        this.isLoggedIn = true
        localStorage.setItem('userId', String(this.userId))
        localStorage.setItem('userName', this.userName)
      } catch (error) {
        this.error = error?.response?.data?.error || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    loadUser() {
      const id = localStorage.getItem('userId')
      const name = localStorage.getItem('userName')
      if (id) {
        this.userId = Number(id)
        this.userName = name || ''
        this.isLoggedIn = true
      }
    },

    clearSession() {
      this.userId = null
      this.userName = ''
      this.isLoggedIn = false
      this.loading = false
      this.error = null
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
    },

    async logout() {
      this.loading = true
      this.error = null

      try {
        await api.post('/logout', {
          user_id: this.userId
        })
      } catch (error) {
        this.error = error?.response?.data?.error || 'Logout failed'
      } finally {
        this.clearSession()
      }
    }
  }
})