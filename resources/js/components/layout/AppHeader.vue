<template>
    <v-app-bar color="white" :elevation="0" height="72" class="appbar">
        <v-navigation-drawer v-model="drawer" temporary>
            <v-list nav>
                <v-list-item title="Tienda" to="/shop" @click="drawer = false" />
                <v-list-item title="Novedades" to="/novedades" @click="drawer = false" />
                <v-list-item title="Sobre nosotros" to="/sobre-nosotros" @click="drawer = false" />

                <v-divider class="my-2" />

                <v-list-item title="Iniciar sesión" to="/login" @click="drawer = false" />
                <v-list-item title="Registrarse" to="/register" @click="drawer = false" />
            </v-list>
        </v-navigation-drawer>

        <v-container fluid class="px-8">
            <v-row align="center" no-gutters>
                <v-btn icon variant="text" class="d-sm-none mr-2" aria-label="Abrir menú" @click="drawer = true">
                    <v-icon icon="mdi-menu" />
                </v-btn>

                <v-col cols="auto">
                    <RouterLink to="/" class="brand">
                        <v-icon icon="mdi-feather" size="22" class="brand-icon" />
                        <span class="brand-text">TiendaModa</span>
                    </RouterLink>
                </v-col>

                <v-col class="d-none d-sm-flex justify-center">
                    <nav class="nav">
                        <v-btn class="nav-btn" variant="text" to="/shop">Tienda</v-btn>
                        <v-btn class="nav-btn" variant="text" to="/novedades">Novedades</v-btn>
                        <v-btn class="nav-btn" variant="text" to="/sobre-nosotros">Sobre nosotros</v-btn>
                    </nav>
                </v-col>

                <v-col cols="auto" class="d-flex align-center ga-2 ml-auto">
                    <v-btn variant="outlined" rounded="lg" class="text-none d-none d-sm-inline-flex" to="/login">
                        Iniciar sesión
                    </v-btn>

                    <v-btn color="primary" variant="flat" rounded="lg" class="text-none d-none d-sm-inline-flex"
                        to="/register">
                        Registrarse
                    </v-btn>

                    <v-badge :content="cart.totalItems" :model-value="cart.totalItems > 0" color="primary" offset-x="6"
                        offset-y="6">
                        <v-btn icon variant="text" aria-label="Carrito" class="cart-btn" @click="cartOpen = true">
                            <v-icon icon="mdi-cart-outline" />
                        </v-btn>
                    </v-badge>

                    <v-btn icon variant="text" class="d-sm-none" to="/login" aria-label="Cuenta">
                        <v-icon icon="mdi-account-circle-outline" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>

    <CartDrawer v-model="cartOpen" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../../stores/cart'
import { useUiStore } from '../../stores/ui'
import CartDrawer from '../CartDrawer.vue'

const drawer = ref(false)

const cart = useCartStore()
const ui = useUiStore()

// v-model para el drawer, pero guardado en Pinia (así lo puede leer el botón flotante)
const cartOpen = computed({
    get: () => ui.cartOpen,
    set: (v) => (ui.cartOpen = v),
})
</script>

<style scoped>
.appbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: inherit;
}

.brand-text {
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -0.2px;
}

.brand-icon {
    opacity: 0.9;
}

.nav {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    white-space: nowrap;
}

.nav-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0;
    border-radius: 12px;
}

.nav-btn:hover {
    background: rgba(19, 127, 236, 0.08);
}

.cart-btn {
    position: relative;
}
</style>
