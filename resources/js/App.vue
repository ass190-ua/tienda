<template>
    <v-app class="app-shell">
        <AppHeader />

        <v-main class="app-main">
            <div class="page-wrap">
                <router-view v-slot="{ Component }">
                    <component :is="Component" class="page" />
                </router-view>
            </div>
        </v-main>

        <AppFooter />

        <ScrollToTop />
    </v-app>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import ScrollToTop from './components/ScrollToTop.vue';
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
