<template>
    <v-container class="py-6 px-8">
        <!-- Buscador largo (100%) -->
        <v-text-field :model-value="q" @update:modelValue="setQ" outlined solo clearable @click:clear="clearQ"
            rounded="lg" hide-details prepend-inner-icon="mdi-magnify" placeholder="Buscar prendas, marcas…"
            class="w-100 mb-6 custom-search-field" />

        <v-fade-transition mode="out-in">
            <div :key="isSearching ? 'search' : 'home'">
                <SearchPanel v-if="isSearching" :query="q" />

                <div v-else>
                    <v-card class="hero" rounded="xl" elevation="0">
                        <v-img height="300" cover
                            src="https://images.unsplash.com/photo-1520975958225-0f45c2f65b84?auto=format&fit=crop&w=1600&q=80">
                            <div class="hero-overlay">
                                <div class="text-h4 text-md-h3 font-weight-bold mb-2">
                                    Colección primavera/verano 26
                                </div>
                                <div class="text-body-2 text-md-body-1 text-medium-emphasis mb-4">
                                    Descubre las últimas tendencias y estilos para la nueva temporada.
                                </div>

                                <v-btn color="primary" rounded="lg" class="text-none" @click="focusSearch">
                                    Comprar ahora
                                </v-btn>
                            </div>
                        </v-img>
                    </v-card>

                    <!-- Colecciones destacadas -->
                    <div class="mt-8">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Colecciones destacadas</div>

                        <v-row class="gy-4">
                            <v-col cols="12" sm="4">
                                <v-card class="collection-card" rounded="xl" elevation="2" @click="setQ('mujer')">
                                    <v-img height="150" cover
                                        src="https://images.unsplash.com/photo-1520975682031-a7ae7e56875c?auto=format&fit=crop&w=900&q=80">
                                        <div class="collection-overlay">
                                            <div class="collection-title">Novedades Mujer</div>
                                        </div>
                                    </v-img>
                                </v-card>
                            </v-col>

                            <v-col cols="12" sm="4">
                                <v-card class="collection-card" rounded="xl" elevation="2" @click="setQ('hombre')">
                                    <v-img height="150" cover
                                        src="https://images.unsplash.com/photo-1520975746200-1b3d0a2d9a8c?auto=format&fit=crop&w=900&q=80">
                                        <div class="collection-overlay">
                                            <div class="collection-title">Lo más vendido Hombre</div>
                                        </div>
                                    </v-img>
                                </v-card>
                            </v-col>

                            <v-col cols="12" sm="4">
                                <v-card class="collection-card" rounded="xl" elevation="2" @click="setQ('ofertas')">
                                    <v-img height="150" cover
                                        src="https://images.unsplash.com/photo-1520975869019-9c43f6b3f8b2?auto=format&fit=crop&w=900&q=80">
                                        <div class="collection-overlay">
                                            <div class="collection-title">Ofertas de la semana</div>
                                        </div>
                                    </v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- Recomendaciones -->
                    <div class="mt-8">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Te podría interesar</div>

                        <v-row class="gy-6">
                            <v-col v-for="p in picks" :key="p.id" cols="12" sm="6" md="3">
                                <v-card rounded="xl" elevation="2" class="product-card" @click="setQ(p.keyword)">
                                    <v-img :src="p.image" height="180" cover />
                                    <v-card-text class="pt-4">
                                        <div class="font-weight-bold">{{ p.name }}</div>
                                        <div class="text-medium-emphasis text-body-2 mt-1">{{ p.desc }}</div>
                                        <div class="mt-3 text-h6 font-weight-bold">{{ p.price }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
        </v-fade-transition>
    </v-container>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import SearchPanel from '../components/SearchPanel.vue'

const q = ref('')

const isSearching = computed(() => (q.value ?? '').trim().length > 0)

function setQ(val) {
    q.value = (val ?? '').toString()
}

function clearQ() {
    q.value = ''
}

async function focusSearch() {
    await nextTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const picks = [
    { id: 1, name: 'Chaqueta Denim Clásica', desc: 'Hombre', price: '59,99 €', keyword: 'chaqueta', image: 'https://picsum.photos/seed/pick1/600/500' },
    { id: 2, name: 'Vestido Floral de Verano', desc: 'Mujer', price: '75,00 €', keyword: 'vestido', image: 'https://picsum.photos/seed/pick2/600/500' },
    { id: 3, name: 'Camiseta Gráfica', desc: 'Unisex', price: '24,90 €', keyword: 'camiseta', image: 'https://picsum.photos/seed/pick3/600/500' },
    { id: 4, name: 'Sudadera con Capucha', desc: 'Unisex', price: '49,95 €', keyword: 'sudadera', image: 'https://picsum.photos/seed/pick4/600/500' },
]
</script>

<style scoped>
.custom-search-field {
    background-color: white;
    border-radius: 8px;
    font-size: 16px;
}

.hero {
    overflow: hidden;
}

.hero-overlay {
    height: 100%;
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 680px;
    background: linear-gradient(90deg, rgba(0, 0, 0, .55), rgba(0, 0, 0, 0));
    color: white;
}

.collection-card {
    cursor: pointer;
    overflow: hidden;
}

.collection-overlay {
    height: 100%;
    display: flex;
    align-items: end;
    padding: 12px;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .55));
}

.collection-title {
    color: white;
    font-weight: 800;
}

.product-card {
    cursor: pointer;
    transition: transform 120ms ease;
}

.product-card:hover {
    transform: translateY(-2px);
}
</style>
