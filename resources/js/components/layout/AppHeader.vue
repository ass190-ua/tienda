<template>
    <v-app-bar flat class="border-b" color="white" density="comfortable">
        <v-container class="d-flex align-center py-0">
            <router-link to="/" class="d-flex align-center text-decoration-none mr-4">
                <v-icon icon="mdi-feather" color="primary" size="large" class="mr-2" />
                <span class="text-h6 font-weight-bold text-black">TiendaModa</span>
            </router-link>

            <div class="d-none d-md-flex ml-4 gap-4">
                <v-btn to="/" variant="text">Inicio</v-btn>
                <v-btn to="/shop" variant="text">Tienda</v-btn>
                <v-btn to="/novedades" variant="text">Novedades</v-btn>
            </div>

            <v-spacer />

            <v-text-field
                density="compact"
                variant="outlined"
                label="Buscar productos..."
                append-inner-icon="mdi-magnify"
                single-line
                hide-details
                class="d-none d-sm-flex mr-4"
                style="max-width: 300px"
            />

            <div class="d-flex align-center">
                <v-btn icon to="/cart" class="mr-2">
                    <v-badge content="0" color="error" floating>
                        <v-icon>mdi-cart-outline</v-icon>
                    </v-badge>
                </v-btn>

                <div v-if="!auth.user" class="d-flex align-center">
                    <v-btn to="/login" variant="text" class="mr-1">Ingresar</v-btn>
                    <v-btn to="/register" color="primary" variant="flat">Registro</v-btn>
                </div>

                <v-menu v-else location="bottom end">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="text" class="text-none">
                            <v-avatar color="primary" size="32" class="mr-2">
                                <span class="text-white text-caption">
                                    {{ auth.user.name.charAt(0).toUpperCase() }}
                                </span>
                            </v-avatar>
                            {{ auth.user.name }}
                            <v-icon icon="mdi-chevron-down" size="small" class="ml-1" />
                        </v-btn>
                    </template>

                    <v-list elevation="3" rounded="lg" class="mt-2">
                        <v-list-item to="/profile" prepend-icon="mdi-account-outline" title="Mi Perfil" />
                        <v-list-item to="/orders" prepend-icon="mdi-package-variant-closed" title="Mis Pedidos" />
                        <v-divider class="my-2" />
                        <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" />
                    </v-list>
                </v-menu>
            </div>
        </v-container>
    </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
    await auth.logout()
    router.push('/login')
}
</script>
