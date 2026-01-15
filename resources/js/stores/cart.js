import { defineStore } from 'pinia'
import axios from 'axios'

function mergeItemLists(baseItems, incomingItems) {
    const map = new Map()

    for (const it of (baseItems ?? [])) {
        if (!it?.key) continue
        map.set(it.key, { ...it, qty: Number(it.qty ?? 1) })
    }

    for (const it of (incomingItems ?? [])) {
        const k = it?.key
        if (!k) continue

        if (map.has(k)) {
            const existing = map.get(k)
            existing.qty = Number(existing.qty ?? 1) + Number(it.qty ?? 1)

            existing.product = existing.product ?? it.product
            existing.size = existing.size ?? it.size
            existing.color = existing.color ?? it.color

            existing.size_id = existing.size_id ?? it.size_id
            existing.color_id = existing.color_id ?? it.color_id
        } else {
            map.set(k, { ...it, qty: Number(it.qty ?? 1) })
        }
    }

    return Array.from(map.values())
}

function legacyLineKey(productId, size, color) {
    return `${productId}__${size ?? ''}__${color ?? ''}`
}

function lineKey(productId, size_id, color_id, size, color) {
    const s = size_id ? `sid:${size_id}` : `s:${size ?? ''}`
    const c = color_id ? `cid:${color_id}` : `c:${color ?? ''}`
    return `${productId}__${s}__${c}`
}

const CART_KEY_BASE = 'tiendamoda_cart'

const LEGACY_KEYS = [
    CART_KEY_BASE,
    `${CART_KEY_BASE}_v1`,
    'urbano_cart',
    'urbano_cart_v1'
]

function storageKeyFor(userId) {
    // Invitado: persistimos
    if (!userId) return `${CART_KEY_BASE}__guest`
    // Usuario logueado: NO persistimos en localStorage
    return null
}

function loadCart(key) {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function saveCart(key, items) {
    try {
        localStorage.setItem(key, JSON.stringify(items))
    } catch {
        // no rompemos la app
    }
}

// =============================
// Availability con caché
// =============================
const availabilityCache = new Map() // productId -> { ts, data }
const AV_CACHE_MS = 10_000

async function fetchAvailabilityCached(productId) {
    const pid = Number(productId)
    if (!pid) return { available: 0 }

    const now = Date.now()
    const hit = availabilityCache.get(pid)
    if (hit && (now - hit.ts) < AV_CACHE_MS) return hit.data

    const { data } = await axios.get(`/api/products/${pid}/availability`)
    availabilityCache.set(pid, { ts: now, data })
    return data
}

async function clampToAvailability(productId, desiredQty) {
    const desired = Math.max(0, Number(desiredQty ?? 0))

    try {
        const a = await fetchAvailabilityCached(productId)
        const maxQty = Math.max(0, Number(a.available ?? 0))
        return { qty: Math.min(desired, maxQty), availability: a }
    } catch {
        // Si falla availability, no rompemos UX: dejamos pasar (el backend mandará 422 si toca)
        return { qty: desired, availability: null }
    }
}

export const useCartStore = defineStore('cart', {
    state: () => {
        const initialKey = storageKeyFor(null)
        let items = loadCart(initialKey)

        // Migración opcional de legacy keys
        if (items.length === 0) {
            for (const k of LEGACY_KEYS) {
                const legacyItems = loadCart(k)
                if (legacyItems.length) {
                    items = legacyItems
                    saveCart(initialKey, legacyItems)
                    try { localStorage.removeItem(k) } catch { }
                    break
                }
            }
        }

        return {
            userId: null,
            storageKey: initialKey,
            items, // [{ key, product, qty, size, color, size_id, color_id }]

            // UX
            stockWarning: null, // { productId, available, message } | null
            syncing: false,
            isPulling: false,
            pulledOnce: false,
        }
    },

    getters: {
        cartItems: (s) => s.items,

        totalItems: (s) => s.items.reduce((acc, it) => acc + (it.qty ?? 1), 0),

        subtotal: (s) =>
            s.items.reduce((acc, it) => {
                const price = Number(it.product?.price ?? it.price ?? 0)
                return acc + price * Number(it.qty ?? 1)
            }, 0),

        isEmpty: (s) => s.items.length === 0,
    },

    actions: {
        _persist() {
            if (!this.storageKey) return
            saveCart(this.storageKey, this.items)
        },

        _warnStock(productId, available) {
            this.stockWarning = {
                productId: Number(productId),
                available: Number(available ?? 0),
                message: `Stock insuficiente. Máximo disponible: ${Number(available ?? 0)}`
            }
        },

        clearStockWarning() {
            this.stockWarning = null
        },

        // =============================
        // Backend sync helpers
        // =============================
        _isBackendEnabled() {
            return this.userId !== null
        },

        _applyBackendCartPayload(payload) {
            const backendItems = Array.isArray(payload?.items) ? payload.items : []

            this.items = backendItems.map((it) => {
                const p = it.product ?? null
                const productId = Number(it.product_id ?? p?.id)
                const qty = Number(it.quantity ?? 0)

                // Si backend ya trae size_id/color_id dentro de product, lo usamos.
                const size_id = p?.size_id ?? null
                const color_id = p?.color_id ?? null
                const size = p?.size ?? null
                const color = p?.color ?? null

                return {
                    key: lineKey(productId, size_id, color_id, size, color),
                    product: p ?? { id: productId },
                    qty,
                    size,
                    color,
                    size_id,
                    color_id,
                }
            }).filter(i => i.qty > 0)

            this._persist()
        },

        async pullFromBackend(force = false) {
            if (!this._isBackendEnabled()) return

            if (this.isPulling) return
            if (this.pulledOnce && !force) return

            this.isPulling = true
            this.syncing = true
            try {
                const { data } = await axios.get('/api/cart')
                this._applyBackendCartPayload(data)
                this.pulledOnce = true
            } catch (e) {
                if (e?.response?.status === 401) {
                    console.warn('[cart] pullFromBackend: no autenticado')
                } else {
                    console.warn('[cart] pullFromBackend error', e)
                }
            } finally {
                this.syncing = false
                this.isPulling = false
            }
        },

        async _syncSetQty(productId, quantity) {
            if (!this._isBackendEnabled()) return

            const pid = Number(productId)
            const qty = Math.max(0, Number(quantity ?? 0))
            if (!pid) return

            // invalidamos caché availability para este producto (cambia la reserva)
            availabilityCache.delete(pid)

            this.syncing = true
            try {
                const { data } = await axios.post('/api/cart/items', {
                    product_id: pid,
                    quantity: qty,
                })

                this.clearStockWarning()
                this._applyBackendCartPayload(data)
            } catch (e) {
                const status = e?.response?.status

                if (status === 422) {
                    const available = e?.response?.data?.available ?? 0
                    this._warnStock(pid, available)
                    // Reconciliamos con backend para quedarnos con lo aceptado
                    await this.pullFromBackend(true)
                    return
                }

                if (status === 401) {
                    console.warn('[cart] sync: no autenticado (sesión expirada?)')
                    return
                }

                console.warn('[cart] sync error', e)
            } finally {
                this.syncing = false
            }
        },

        async _syncClear() {
            if (!this._isBackendEnabled()) return

            this.syncing = true
            try {
                const { data } = await axios.delete('/api/cart')
                this.clearStockWarning()
                this._applyBackendCartPayload(data)
            } catch (e) {
                const status = e?.response?.status
                if (status === 401) {
                    console.warn('[cart] clear: no autenticado')
                    return
                }
                console.warn('[cart] clear error', e)
            } finally {
                this.syncing = false
            }
        },

        // Sincroniza TODO el carrito local a backend (útil tras login/merge)
        async syncToBackend() {
            if (!this._isBackendEnabled()) return

            // agrupamos por productId (por si hubiese duplicados)
            const map = new Map()
            for (const it of (this.items ?? [])) {
                const pid = Number(it.product?.id ?? it.product_id ?? null)
                if (!pid) continue
                const q = Math.max(0, Number(it.qty ?? 0))
                map.set(pid, (map.get(pid) ?? 0) + q)
            }

            this.syncing = true
            try {
                // dejarmos el backend EXACTO al local: vaciamos y re-seteamos
                await axios.delete('/api/cart')

                let lastPayload = null
                for (const [pid, q] of map.entries()) {
                    if (q <= 0) continue
                    const { data } = await axios.post('/api/cart/items', { product_id: pid, quantity: q })
                    lastPayload = data
                }

                this.clearStockWarning()

                if (lastPayload) {
                    this._applyBackendCartPayload(lastPayload)
                } else {
                    await this.pullFromBackend()
                }
            } catch (e) {
                const status = e?.response?.status
                if (status === 422) {
                    const pid = e?.response?.data?.product_id
                    const available = e?.response?.data?.available ?? 0
                    this._warnStock(pid, available)
                    await this.pullFromBackend()
                    return
                }
                if (status === 401) {
                    console.warn('[cart] syncToBackend: no autenticado')
                    return
                }
                console.warn('[cart] syncToBackend error', e)
            } finally {
                this.syncing = false
            }
        },

        // =============================
        // Owner / local behavior
        // =============================
        async setOwner(userId) {
            const nextUserId = userId ?? null

            // Invitado -> usuario: merge guest + user local
            if (this.userId === null && nextUserId !== null) {
                const guestKey = storageKeyFor(null)

                const guestItems =
                    this.storageKey === guestKey ? (this.items ?? []) : loadCart(guestKey)

                // Pasamos a user
                this.userId = nextUserId
                this.storageKey = storageKeyFor(this.userId)
                this.pulledOnce = false

                // Vaciamos guest local (ya no lo usaremos)
                saveCart(guestKey, [])
                this.items = []
                this._persist()

                // Subimos el carrito guest al backend como fuente de verdad
                // (requiere que tengas syncToBackend implementado)
                // Si no, lo hacemos item por item.
                try {
                    // si tu store tiene syncToBackend:
                    this.items = guestItems
                    await this.syncToBackend?.()
                    await this.pullFromBackend?.()
                } catch {
                    // fallback: al menos hidratamos desde backend
                    this.pullFromBackend?.()
                }

                return
            }

            // Otro caso: cambiamos dueño y cargamos su storage
            this.userId = nextUserId
            this.storageKey = storageKeyFor(this.userId)
            this.pulledOnce = false

            if (this._isBackendEnabled()) {
                // Usuario: backend manda. No cargamos nada de localStorage.
                this.items = []
                this.pullFromBackend().catch(() => { })
                return
            }

            // Invitado: seguimos usando localStorage
            this.items = loadCart(this.storageKey)
        },

        // =============================
        // Cart actions (local + backend sync)
        // =============================
        async addToCart({ product, qty = 1, size = null, color = null, size_id = null, color_id = null }) {
            if (!product) return

            const productId = product.id ?? product.productId
            if (!productId) return

            const q = Math.max(1, Number(qty ?? 1))

            const newKey = lineKey(productId, size_id, color_id, size, color)
            const oldKey = legacyLineKey(productId, size, color)

            let existing = this.items.find((i) => i.key === newKey)
                || this.items.find((i) => i.key === oldKey)

            const currentQty = existing ? Number(existing.qty ?? 1) : 0
            const desiredQty = currentQty + q

            const { qty: clampedQty, availability } = await clampToAvailability(productId, desiredQty)

            if (clampedQty !== desiredQty) {
                this._warnStock(productId, availability?.available ?? clampedQty)
            } else {
                this.clearStockWarning()
            }

            if (clampedQty <= 0) return

            if (existing) {
                if (existing.key !== newKey) existing.key = newKey

                existing.qty = clampedQty
                existing.product = existing.product ?? product

                existing.size = size ?? existing.size ?? null
                existing.color = color ?? existing.color ?? null
                existing.size_id = size_id ?? existing.size_id ?? null
                existing.color_id = color_id ?? existing.color_id ?? null

                this._persist()
            } else {
                this.items.push({
                    key: newKey,
                    product,
                    qty: clampedQty,
                    size,
                    color,
                    size_id,
                    color_id,
                })
                this._persist()
            }

            // Backend: reserva real
            await this._syncSetQty(productId, clampedQty)
        },

        async removeItem(key) {
            const it = this.items.find((i) => i.key === key)
            const productId = it?.product?.id ?? it?.product_id ?? null

            this.items = this.items.filter((i) => i.key !== key)
            this._persist()

            if (productId) {
                await this._syncSetQty(productId, 0)
            }
        },

        async inc(key) {
            const it = this.items.find((i) => i.key === key)
            if (!it) return

            const productId = it.product?.id ?? it.product_id ?? null
            if (!productId) {
                it.qty = Number(it.qty ?? 1) + 1
                this._persist()
                return
            }

            const current = Number(it.qty ?? 1)
            const desired = current + 1

            const { qty: clamped, availability } = await clampToAvailability(productId, desired)

            if (clamped === current) {
                this._warnStock(productId, availability?.available ?? current)
                return
            }

            this.clearStockWarning()
            it.qty = clamped
            this._persist()

            await this._syncSetQty(productId, clamped)
        },

        async dec(key) {
            const it = this.items.find((i) => i.key === key)
            if (!it) return

            const productId = it.product?.id ?? it.product_id ?? null

            const next = Number(it.qty ?? 1) - 1
            if (next <= 0) {
                // local
                this.items = this.items.filter((i) => i.key !== key)
                this._persist()

                // backend
                if (productId) await this._syncSetQty(productId, 0)
                return
            }

            it.qty = next
            this._persist()

            if (productId) await this._syncSetQty(productId, next)
        },

        async clear() {
            this.items = []
            this._persist()
            await this._syncClear()
        },

        // Aliases
        increment(key) { return this.inc(key) },
        decrement(key) { return this.dec(key) },
        increaseQty(key) { return this.inc(key) },
        decreaseQty(key) { return this.dec(key) },
        clearCart() { return this.clear() },
        removeFromCart(key) { return this.removeItem(key) },
        removeLine(key) { return this.removeItem(key) },
    },
})
