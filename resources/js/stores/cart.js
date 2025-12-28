import { defineStore } from 'pinia'

function keyOf(productId, size, color) {
    return `${productId}__${size ?? ''}__${color ?? ''}`
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [], // [{ key, productId, name, brand, price, image, size, color, qty }]
    }),

    getters: {
        totalItems: (state) => state.items.reduce((acc, it) => acc + it.qty, 0),
        subtotal: (state) => state.items.reduce((acc, it) => acc + it.price * it.qty, 0),
        isEmpty: (state) => state.items.length === 0,
    },

    actions: {
        addToCart({ product, qty = 1, size = null, color = null }) {
            if (!product) return

            const productId = product.id
            const k = keyOf(productId, size, color)

            const existing = this.items.find(i => i.key === k)
            if (existing) {
                existing.qty += qty
                return
            }

            this.items.push({
                key: k,
                productId,
                name: product.name,
                brand: product.brand,
                price: Number(product.price) || 0,
                image: product.image,
                size,
                color,
                qty,
            })
        },

        removeItem(key) {
            this.items = this.items.filter(i => i.key !== key)
        },

        inc(key) {
            const it = this.items.find(i => i.key === key)
            if (it) it.qty += 1
        },

        dec(key) {
            const it = this.items.find(i => i.key === key)
            if (!it) return
            it.qty = Math.max(1, it.qty - 1)
        },

        clear() {
            this.items = []
        },
    },
})
