<template>
    <div class="search-wrap">
        <!-- Cabecera -->
        <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between ga-2 mb-4">
            <div>
                <div class="text-h5 font-weight-bold">
                    <template v-if="hasQuery">
                        Resultados para “<span class="quote">{{ query }}</span>”
                    </template>
                    <template v-else>
                        Tienda
                    </template>
                </div>

                <div class="text-medium-emphasis text-body-2">
                    Mostrando {{ showingCount }} de {{ filtered.length }}
                    <template v-if="pageCount > 1"> · Página {{ page }} de {{ pageCount }}</template>
                </div>
            </div>

            <div class="d-flex align-center ga-3">
                <div class="text-body-2 text-medium-emphasis">Ordenar:</div>
                <v-select v-model="sort" :items="sortItems" density="comfortable" variant="outlined" hide-details
                    class="sort" />
            </div>
        </div>

        <v-row class="gy-6">
            <!-- Filtros (sticky en desktop) -->
            <v-col cols="12" md="3">
                <div class="filters-sticky">
                    <v-card rounded="xl" elevation="2" class="pa-4 filter-card">
                        <div class="d-flex align-center justify-space-between mb-3">
                            <div class="text-subtitle-1 font-weight-bold d-flex align-center ga-2">
                                <v-icon icon="mdi-tune-variant" size="18" class="text-medium-emphasis" />
                                <span>Filtrar</span>
                                <v-chip v-if="activeFiltersCount > 0" size="x-small" color="primary" variant="tonal"
                                    class="ml-1">
                                    {{ activeFiltersCount }}
                                </v-chip>
                            </div>

                            <v-btn variant="text" class="text-none" :disabled="!hasAnyFilters" @click="clearAll">
                                Limpiar
                            </v-btn>
                        </div>

                        <div class="filter-section">
                            <div class="text-body-2 font-weight-bold mb-2">Talla</div>
                            <div class="d-flex flex-wrap ga-2">
                                <v-btn v-for="s in sizes" :key="s" size="small" rounded="lg" class="text-none"
                                    :variant="selectedSizes.includes(s) ? 'flat' : 'outlined'"
                                    :color="selectedSizes.includes(s) ? 'primary' : undefined" @click="toggleSize(s)">
                                    {{ s }}
                                </v-btn>
                            </div>
                        </div>

                        <v-divider class="my-4" />

                        <div class="filter-section">
                            <div class="text-body-2 font-weight-bold mb-2">Color</div>
                            <div class="d-flex flex-wrap ga-2">
                                <v-btn v-for="c in colors" :key="c.name" icon size="small"
                                    :variant="selectedColors.includes(c.name) ? 'flat' : 'text'"
                                    :color="selectedColors.includes(c.name) ? 'primary' : undefined" class="color-btn"
                                    @click="toggleColor(c.name)" :aria-label="c.name">
                                    <span class="dot" :class="{ selected: selectedColors.includes(c.name) }"
                                        :style="{ background: c.hex }" :title="c.name"></span>
                                </v-btn>
                            </div>
                        </div>

                        <v-divider class="my-4" />

                        <div class="filter-section">
                            <div class="d-flex align-center justify-space-between mb-2">
                                <div class="text-body-2 font-weight-bold">Rango de precio</div>
                                <v-chip v-if="!isPriceDefault" size="x-small" variant="tonal" color="primary">
                                    {{ priceLabel }}
                                </v-chip>
                            </div>

                            <v-range-slider v-model="price" :min="0" :max="200" :step="5" density="comfortable"
                                color="primary" thumb-label="hover" />
                        </div>

                        <v-divider class="my-4" />

                        <div class="filter-section">
                            <div class="text-body-2 font-weight-bold mb-2">Marca</div>
                            <div class="d-flex flex-column ga-1">
                                <v-checkbox v-for="b in brands" :key="b" v-model="selectedBrands" :value="b"
                                    hide-details density="compact" :label="b" />
                            </div>
                        </div>
                    </v-card>
                </div>
            </v-col>

            <!-- Resultados -->
            <v-col cols="12" md="9">
                <!-- Chips activos (con transición) -->
                <TransitionGroup v-if="hasAnyFilters" name="chips" tag="div"
                    class="d-flex flex-wrap align-center ga-2 mb-4">
                    <v-chip v-for="s in selectedSizes" :key="'size-' + s" closable @click:close="removeSize(s)"
                        size="small">
                        Talla: {{ s }}
                    </v-chip>

                    <v-chip v-for="c in selectedColors" :key="'color-' + c" closable @click:close="removeColor(c)"
                        size="small">
                        Color: {{ c }}
                    </v-chip>

                    <v-chip v-for="b in selectedBrands" :key="'brand-' + b" closable @click:close="removeBrand(b)"
                        size="small">
                        Marca: {{ b }}
                    </v-chip>

                    <v-chip v-if="!isPriceDefault" key="price-chip" closable @click:close="resetPrice" size="small">
                        Precio: {{ priceLabel }}
                    </v-chip>
                </TransitionGroup>


                <!-- Grid con transiciones -->
                <TransitionGroup name="grid" tag="div" class="v-row gy-6">
                    <v-col v-for="p in paginated" :key="p.id" cols="12" sm="6" lg="4">
                        <v-hover v-slot="{ isHovering, props: hoverProps }">
                            <v-card v-bind="hoverProps" rounded="xl" :elevation="isHovering ? 6 : 2"
                                class="product-card">
                                <div class="img-wrap">
                                    <v-img :src="p.image" height="230" cover class="rounded-xl product-img"
                                        role="button" tabindex="0" @click="openQuickView(p)"
                                        @keydown.enter.prevent="openQuickView(p)">
                                        <!-- Overlay con solo “Añadir” -->
                                        <div class="img-overlay">
                                            <v-btn color="primary" variant="flat" rounded="lg" class="text-none"
                                                @click.stop="addFromCard(p)">
                                                <v-icon icon="mdi-cart-outline" class="mr-2" />
                                                Añadir
                                            </v-btn>
                                        </div>
                                    </v-img>
                                </div>

                                <v-card-text class="pt-4">
                                    <div class="text-medium-emphasis text-body-2">{{ p.brand }}</div>

                                    <v-tooltip location="top" :text="p.name">
                                        <template #activator="{ props: tip }">
                                            <div class="product-title text-subtitle-1 font-weight-bold" v-bind="tip">
                                                {{ p.name }}
                                            </div>
                                        </template>
                                    </v-tooltip>

                                    <div class="mt-2 d-flex align-center justify-space-between">
                                        <div class="text-primary font-weight-bold">{{ p.price.toFixed(2) }}€</div>

                                        <v-btn icon variant="text" size="small" aria-label="Añadir a favoritos"
                                            @click.stop>
                                            <v-icon icon="mdi-heart-outline" />
                                        </v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col v-if="filtered.length === 0" cols="12" key="no-results">
                        <v-alert type="info" variant="tonal">
                            <template v-if="hasQuery">
                                No hay resultados para “{{ query }}”.
                            </template>
                            <template v-else>
                                No hay productos con los filtros seleccionados.
                            </template>

                            <div class="mt-3">
                                <v-btn v-if="hasAnyFilters" size="small" variant="flat" color="primary" rounded="lg"
                                    class="text-none" @click="clearAll">
                                    Limpiar filtros
                                </v-btn>
                            </div>
                        </v-alert>
                    </v-col>
                </TransitionGroup>

                <!-- Paginación -->
                <div class="pagination-wrap" v-if="pageCount > 1">
                    <v-pagination v-model="page" :length="pageCount" :total-visible="5" prev-icon="mdi-chevron-left"
                        next-icon="mdi-chevron-right" rounded="lg" />
                </div>

                <VistaRapidaDialog v-model="quickViewOpen" :product="quickViewProduct" :colors-palette="colors"
                    @add="onAddToCart" />

                <v-snackbar v-model="snackbar.open" :timeout="2500" color="success" rounded="lg">
                    {{ snackbar.text }}
                </v-snackbar>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import VistaRapidaDialog from './VistaRapidaDialog.vue'
import { useCartStore } from '../stores/cart'

const props = defineProps({
    query: { type: String, required: true },
})

const hasQuery = computed(() => (props.query ?? '').trim().length > 0)

const sortItems = ['Más relevantes', 'Precio: menor a mayor', 'Precio: mayor a menor']
const sort = ref('Más relevantes')

const sizes = ['XS', 'S', 'M', 'L', 'XL']
const selectedSizes = ref([])

const colors = [
    { name: 'Azul', hex: '#2F6FED' },
    { name: 'Rojo', hex: '#E53935' },
    { name: 'Verde', hex: '#43A047' },
    { name: 'Amarillo', hex: '#FDD835' },
    { name: 'Morado', hex: '#8E24AA' },
    { name: 'Negro', hex: '#111111' },
]
const selectedColors = ref([])

const brands = ['Aura', 'Chic Threads', 'Modern Fit']
const selectedBrands = ref([])

const DEFAULT_PRICE = [0, 200]
const price = ref([...DEFAULT_PRICE])

const isPriceDefault = computed(
    () => price.value[0] === DEFAULT_PRICE[0] && price.value[1] === DEFAULT_PRICE[1]
)
const priceLabel = computed(() => `${price.value[0]}€–${price.value[1]}€`)

const hasAnyFilters = computed(() =>
    selectedSizes.value.length > 0 ||
    selectedColors.value.length > 0 ||
    selectedBrands.value.length > 0 ||
    !isPriceDefault.value
)

const activeFiltersCount = computed(() =>
    selectedSizes.value.length +
    selectedColors.value.length +
    selectedBrands.value.length +
    (isPriceDefault.value ? 0 : 1)
)

const products = ref(generateProducts(60))

function generateProducts(n) {
    const baseNames = [
        'Vestido midi', 'Vestido mini', 'Vestido floral', 'Camiseta básica', 'Camiseta gráfica',
        'Sudadera con capucha', 'Chaqueta denim', 'Pantalón cargo', 'Pantalón recto', 'Camisa lino',
        'Top satén', 'Falda plisada', 'Blazer oversize', 'Zapatillas urban', 'Abrigo ligero',
    ]

    const adjectives = [
        'Essential', 'Premium', 'Urban', 'Minimal', 'Classic', 'Summer', 'Soft', 'Trend', 'Studio', 'Daily',
    ]

    const brandList = ['Aura', 'Chic Threads', 'Modern Fit']
    const colorList = ['Azul', 'Rojo', 'Verde', 'Amarillo', 'Morado', 'Negro']
    const sizeList = ['XS', 'S', 'M', 'L', 'XL']

    const items = []

    for (let i = 1; i <= n; i++) {
        const brand = brandList[i % brandList.length]
        const name = `${baseNames[i % baseNames.length]} ${adjectives[i % adjectives.length]}`
        const price = +(19.99 + (i % 20) * 4.25).toFixed(2)

        const c1 = colorList[i % colorList.length]
        const c2 = colorList[(i + 2) % colorList.length]
        const prodColors = (i % 4 === 0) ? [c1, c2] : [c1]

        const start = i % sizeList.length
        const len = 2 + (i % 3)
        const prodSizes = Array.from({ length: len }, (_, k) => sizeList[(start + k) % sizeList.length])

        items.push({
            id: i,
            brand,
            name,
            price,
            sizes: prodSizes,
            colors: prodColors,
            image: `https://picsum.photos/seed/tiendamoda-${i}/800/700`,
        })
    }

    return items
}

const filtered = computed(() => {
    const q = (props.query ?? '').trim().toLowerCase()

    let list = products.value.filter(p => {
        const matchesQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
        const matchesSize = selectedSizes.value.length === 0 || selectedSizes.value.some(s => p.sizes.includes(s))
        const matchesColor = selectedColors.value.length === 0 || selectedColors.value.some(c => p.colors.includes(c))
        const matchesBrand = selectedBrands.value.length === 0 || selectedBrands.value.includes(p.brand)
        const matchesPrice = p.price >= price.value[0] && p.price <= price.value[1]
        return matchesQ && matchesSize && matchesColor && matchesBrand && matchesPrice
    })

    if (sort.value === 'Precio: menor a mayor') list.sort((a, b) => a.price - b.price)
    if (sort.value === 'Precio: mayor a menor') list.sort((a, b) => b.price - a.price)

    return list
})

const page = ref(1)
const perPage = 12
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paginated = computed(() => {
    const start = (page.value - 1) * perPage
    return filtered.value.slice(start, start + perPage)
})
const showingCount = computed(() => paginated.value.length)

const quickViewOpen = ref(false)
const quickViewProduct = ref(null)

const snackbar = ref({ open: false, text: '' })

function toggleColor(c) {
    selectedColors.value = selectedColors.value.includes(c)
        ? selectedColors.value.filter(x => x !== c)
        : [...selectedColors.value, c]
}

function openQuickView(p) {
    quickViewProduct.value = p
    quickViewOpen.value = true
}

function removeSize(s) { selectedSizes.value = selectedSizes.value.filter(x => x !== s) }
function removeColor(c) { selectedColors.value = selectedColors.value.filter(x => x !== c) }
function removeBrand(b) { selectedBrands.value = selectedBrands.value.filter(x => x !== b) }

function resetPrice() {
    price.value = [...DEFAULT_PRICE]
}

function clearAll() {
    selectedSizes.value = []
    selectedColors.value = []
    selectedBrands.value = []
    resetPrice()
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onAddToCart(payload) {
    console.log('Producto añadido al carrito:', payload)
    cart.addToCart(payload)
    snackbar.value.text = `Añadido: ${payload.product?.name} (x${payload.qty})`
    snackbar.value.open = true
}

function addFromCard(product) {
    onAddToCart({
        product,
        qty: 1,
        size: product?.sizes?.[0] ?? null,
        color: product?.colors?.[0] ?? null,
    })
}

const cart = useCartStore()

watch([() => props.query, sort, selectedSizes, selectedColors, selectedBrands, price], () => {
    page.value = 1
}, { deep: true })

watch(pageCount, (pc) => {
    if (page.value > pc) page.value = pc
    if (page.value < 1) page.value = 1
})

function toggleSize(s) {
    selectedSizes.value = selectedSizes.value.includes(s)
        ? selectedSizes.value.filter(x => x !== s)
        : [...selectedSizes.value, s]
}

watch(page, () => scrollToTop())
</script>

<style scoped>
.search-wrap {
    width: 100%;
}

.quote {
    font-weight: 800;
}

.sort {
    min-width: 220px;
}

/* Sticky filters en desktop (ajusta top si tu header es más alto) */
.filters-sticky {
    position: sticky;
    top: 92px;
}

/* Look más premium */
.filter-card {
    border: 1px solid rgba(0, 0, 0, 0.06);
}

/* Cards */
.product-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.06);
    transition: transform 140ms ease;
}

.product-card:hover {
    transform: translateY(-2px);
}

.product-card .v-card-text {
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* título máximo 2 líneas (tooltip para el completo) */
.product-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* overlay acciones */
.img-wrap {
    position: relative;
}

.product-img {
    cursor: pointer;
}

.img-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 12px;
    opacity: 0;
    transition: opacity 160ms ease;
    background: linear-gradient(to top, rgba(0, 0, 0, .35), rgba(0, 0, 0, 0) 60%);
}

/* Mostrar overlay al hover de la imagen */
:deep(.v-img:hover) .img-overlay {
    opacity: 1;
}

.img-overlay.show {
    opacity: 1;
    transform: translateY(0);
}

.btn-overlay {
    border-color: rgba(255, 255, 255, 0.85) !important;
    color: #fff !important;
}

.btn-overlay:hover {
    background: rgba(255, 255, 255, 0.12);
}

/* Pagination estable */
.pagination-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

.pagination-wrap :deep(.v-pagination) {
    min-width: 340px;
}

.pagination-wrap :deep(.v-pagination__list) {
    flex-wrap: nowrap;
}

/* Transición suave al entrar/salir productos */
.grid-enter-active,
.grid-leave-active {
    transition: opacity 220ms ease, transform 220ms ease;
}

.grid-enter-from,
.grid-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.grid-move {
    transition: transform 220ms ease;
}

/* Color dots */
.color-btn {
    padding: 0;
}

.dot {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    display: inline-block;
    border: 2px solid rgba(0, 0, 0, .15);
}

.dot.selected {
    border-color: rgba(19, 127, 236, 0.95);
    box-shadow: 0 0 0 2px rgba(19, 127, 236, 0.18);
}

/* Color del “globito” del thumb-label */
:deep(.v-slider-thumb__label) {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

/* La “punta” del globito */
:deep(.v-slider-thumb__label::before) {
  background: rgb(var(--v-theme-primary)) !important;
}

/* Animación de chips (cada nuevo chip entra suave desde la izquierda) */
.chips-enter-active,
.chips-leave-active {
    transition: opacity 180ms ease, transform 180ms ease;
}

.chips-enter-from,
.chips-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

.chips-move {
    transition: transform 180ms ease;
}
</style>
