import { defineStore } from 'pinia'
import axios from 'axios'
import { useCartStore } from './cart'
import { useWishlistStore } from './wishlist'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        // Obtener el usuario actual
        async fetchUser() {
            try {
                const { data, status } = await axios.get('/api/user')

                if (status === 204 || !data) {
                    this.user = null
                } else {
                    this.user = data
                }

                const cart = useCartStore()
                cart.setOwner(this.user?.id ?? null)

                if (cart.userId) {
                    try { await cart.pullFromBackend?.() } catch { }
                }
            } catch {
                this.user = null
                const cart = useCartStore()
                cart.setOwner(null)
            } finally {
                this.initialized = true
            }
        },

        async updateProfile(payload) {
            // payload: { name }
            await axios.get('/sanctum/csrf-cookie')
            const { data } = await axios.put('/api/user', payload)
            this.user = data
            return data
        },


        async login(credentials) {
            // 1. Pedir cookie CSRF (seguridad obligatoria de Laravel)
            await axios.get('/sanctum/csrf-cookie')
            // 2. Hacer login
            await axios.post('/api/login', credentials)
            // 3. Obtener datos del usuario
            await this.fetchUser()

            console.log('[AUTH] Usuario logueado:', this.user)
        },

        async register(userData) {
            await axios.get('/sanctum/csrf-cookie')
            await axios.post('/api/register', userData)
            await this.fetchUser()

            console.log('[AUTH] Usuario registrado y logueado:', this.user)
        },

        async logout() {
            await axios.get('/sanctum/csrf-cookie')
            await axios.post('/api/logout')

            await this.fetchUser()

            const cart = useCartStore()
            cart.setOwner(null)

            console.log('[AUTH] Cerrandp sesión...')
        }
    }
})
