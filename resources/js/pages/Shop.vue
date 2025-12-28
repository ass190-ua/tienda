<template>
    <v-container class="py-6 px-8">
        <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between ga-4 mb-6">
            <div>
                <h1 class="text-h4 font-weight-bold mb-1">TiendaModa</h1>
                <div class="text-medium-emphasis">Explora todo el catálogo y filtra como quieras.</div>
            </div>

            <div class="w-100 w-md-auto busqueda">
                <v-text-field v-model="q" clearable variant="outlined" density="comfortable" rounded="lg" hide-details
                    prepend-inner-icon="mdi-magnify" placeholder="Buscar prendas, marcas…" />
            </div>
        </div>

        <SearchPanel :query="q" />
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import SearchPanel from '../components/SearchPanel.vue'

const q = ref('')
</script>

<style scoped>
.busqueda {
    min-width: 420px;
    max-width: 640px;
}
</style>
