<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const authStore = useAuthStore()

// Al arrancar la App, intentamos recuperar al usuario si tiene cookie válida
onMounted(async () => {
    await authStore.fetchUser()
})
</script>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 1 auto;
  display: flex;
  background: rgb(var(--v-theme-background));
}

.page-wrap {
  flex: 1 1 auto;
  display: flex;
  padding: 32px 0;
}

.page {
  flex: 1 1 auto;
}
</style>
