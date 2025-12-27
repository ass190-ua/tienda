<template>
  <div class="page">
    <!-- HEADER (estilo similar al mockup de búsqueda, pero con Urbano + rutas reales) -->
    <header class="header">
      <div class="header__inner container">
        <div class="brand">
          <span class="brand__logo" aria-hidden="true">
            <svg fill="currentColor" viewBox="0 0 48 48">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
              />
            </svg>
          </span>
          <router-link class="brand__name" to="/">Urbano</router-link>

          <!-- Search dentro del header (md+) -->
          <form class="headerSearch" @submit.prevent="applySearch">
            <span class="headerSearch__icon material-symbols-outlined">search</span>
            <input
              v-model="q"
              class="headerSearch__input"
              type="text"
              placeholder="Search"
              autocomplete="off"
            />
          </form>
        </div>

        <nav class="nav" aria-label="Categorías">
          <router-link :to="{ path: '/buscar', query: { categoria: 'hombre' } }">Hombre</router-link>
          <router-link :to="{ path: '/buscar', query: { categoria: 'mujer' } }">Mujer</router-link>
          <router-link :to="{ path: '/buscar', query: { categoria: 'ninos' } }">Niños</router-link>
          <router-link :to="{ path: '/buscar', query: { categoria: 'ofertas' } }">Ofertas</router-link>
        </nav>

        <div class="actions">
          <router-link class="iconbtn" to="/wishlist" aria-label="Wishlist">
            <span class="material-symbols-outlined">favorite</span>
          </router-link>
          <router-link class="iconbtn" to="/carrito" aria-label="Carrito">
            <span class="material-symbols-outlined">shopping_bag</span>
          </router-link>

          <router-link class="avatar" to="/login" aria-label="Cuenta">
            <img
              alt="Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa9yuthWKBMt_4jG7VEA-7Su0_NUyBeMPDfBCY8nMrC7gP1158K-XFgMDwID7W8z-RPjvjhc9fhS9E8T_H_ZEKVsydV_-n0je-wPaKSEV2LpBvNAQ-GgeELRVLFWkNjd5pK7o3MzUFer7BfzQEpJakWkbYj17bdYODaFKedqGL9XQJ2jlEr5E1qlWVy1pr1W2666JLOZgKca6258iW8Ru4tiOlW_kkF9JHPIpaFtWi2HCNKMV5P4cObM7AcRU8y0zRlawq1gDOeAEg"
            />
          </router-link>

          <!-- Botón filtros en móvil -->
          <button class="iconbtn iconbtn--filters" type="button" @click="mobileFiltersOpen = true" aria-label="Filtros">
            <span class="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>
    </header>

    <main class="container searchPage">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <router-link class="breadcrumbs__link" to="/">Home</router-link>
        <span class="breadcrumbs__sep">/</span>

        <template v-if="categoriaTitle">
          <router-link class="breadcrumbs__link" :to="{ path: '/buscar', query: { categoria: categoriaKey } }">
            {{ categoriaTitle }}
          </router-link>
          <span class="breadcrumbs__sep">/</span>
        </template>

        <span class="breadcrumbs__current">Search</span>
      </nav>

      <!-- Heading -->
      <section class="heading">
        <div class="heading__left">
          <h1 class="heading__title">
            Results for '<span class="heading__q">{{ q || "todo" }}</span>'
          </h1>
          <p class="heading__sub">
            Showing {{ pagedProducts.length }} of {{ filteredProducts.length }} products
          </p>
        </div>
      </section>

      <div class="layout">
        <!-- SIDEBAR FILTERS -->
        <aside class="sidebar" :class="{ 'sidebar--open': mobileFiltersOpen }" aria-label="Filtros">
          <div class="sidebarCard">
            <div class="sidebarTop">
              <h3 class="sidebarTitle">Filter by</h3>
              <button class="linkBtn" type="button" @click="clearAll">Clear all</button>
            </div>

            <div class="filters">
              <!-- Size -->
              <div class="filterBlock">
                <div class="filterTitle">Size</div>
                <div class="sizeGrid">
                  <button
                    v-for="s in sizes"
                    :key="s"
                    type="button"
                    class="sizeBtn"
                    :class="{ 'sizeBtn--active': selectedSize === s }"
                    @click="toggleSize(s)"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>

              <!-- Color -->
              <div class="filterBlock">
                <div class="filterTitle">Color</div>
                <div class="colorRow">
                  <button
                    v-for="c in colors"
                    :key="c.key"
                    type="button"
                    class="colorDot"
                    :style="{ background: c.hex }"
                    :class="{ 'colorDot--active': selectedColor === c.key }"
                    @click="toggleColor(c.key)"
                    :aria-label="`Color ${c.label}`"
                  />
                </div>
              </div>

              <!-- Price -->
              <div class="filterBlock">
                <div class="filterTitle">Price Range</div>

                <div class="rangeWrap">
                  <div class="rangeTrack">
                    <div class="rangeFill" :style="rangeFillStyle"></div>
                  </div>

                  <input
                    class="rangeInput"
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    v-model.number="priceMin"
                    @change="applyFilters"
                  />
                  <input
                    class="rangeInput"
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    v-model.number="priceMax"
                    @change="applyFilters"
                  />
                </div>

                <div class="rangeValues">
                  <span>€{{ priceMin }}</span>
                  <span>€{{ priceMax }}</span>
                </div>
              </div>

              <!-- Brand -->
              <div class="filterBlock">
                <div class="filterTitle">Brand</div>
                <div class="brandList">
                  <label v-for="b in brands" :key="b" class="checkRow">
                    <input type="checkbox" :value="b" v-model="selectedBrands" @change="applyFilters" />
                    <span>{{ b }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="sidebarBottom">
              <button class="btn-primary w100" type="button" @click="applyFiltersAndCloseMobile">
                Apply filters
              </button>
              <button class="btn-ghost w100" type="button" @click="mobileFiltersOpen = false">
                Close
              </button>
            </div>
          </div>

          <!-- overlay móvil -->
          <div v-if="mobileFiltersOpen" class="overlay" @click="mobileFiltersOpen = false"></div>
        </aside>

        <!-- RESULTS -->
        <section class="results">
          <!-- Chips -->
          <div class="chips">
            <div class="chip chip--select">
              <span class="chip__text">Sort:</span>
              <select v-model="sort" class="chipSelect" @change="applyFilters">
                <option value="relevant">Most Relevant</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>

            <button
              v-for="chip in activeChips"
              :key="chip.key"
              type="button"
              class="chip chip--active"
              @click="removeChip(chip.key)"
              :aria-label="`Quitar filtro ${chip.label}`"
            >
              <span class="chip__text">{{ chip.label }}</span>
              <span class="material-symbols-outlined chip__x">close</span>
            </button>
          </div>

          <!-- Grid -->
          <div class="productGrid">
            <article v-for="p in pagedProducts" :key="p.id" class="card" @click="goProduct(p.id)">
              <div class="card__imgWrap">
                <img class="card__img" :src="p.image" :alt="p.alt" loading="lazy" />
                <button class="bagBtn" type="button" @click.stop="addToCart(p)">
                  <span class="material-symbols-outlined">shopping_bag</span>
                </button>
              </div>

              <div class="card__body">
                <div class="card__brand">{{ p.brand }}</div>
                <div class="card__name">{{ p.name }}</div>
                <div class="card__price">€{{ p.price.toFixed(2) }}</div>
              </div>
            </article>

            <div v-if="pagedProducts.length === 0" class="empty">
              No results with current filters.
            </div>
          </div>

          <!-- Pagination -->
          <nav class="pagination" aria-label="Pagination" v-if="totalPages > 1">
            <button class="pageBtn" type="button" :disabled="page === 1" @click="setPage(page - 1)">
              Previous
            </button>

            <div class="pageNums">
              <button
                v-for="n in pageNumbers"
                :key="n"
                class="pageNum"
                :class="{ 'pageNum--active': n === page }"
                type="button"
                @click="setPage(n)"
              >
                {{ n }}
              </button>
            </div>

            <button class="pageBtn" type="button" :disabled="page === totalPages" @click="setPage(page + 1)">
              Next
            </button>
          </nav>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

/** ---- state (sin backend, mock + querystring) ---- */
const q = ref("");
const selectedSize = ref("");
const selectedColor = ref("");
const selectedBrands = ref([]);
const sort = ref("relevant");
const priceMin = ref(50);
const priceMax = ref(500);
const page = ref(1);

const perPage = 9;
const mobileFiltersOpen = ref(false);

/** ---- mock data (luego se sustituye por API) ---- */
const products = [
  {
    id: 1,
    brand: "Aura",
    name: "Floral Sundress",
    price: 79.99,
    category: "mujer",
    colors: ["blue", "yellow"],
    sizes: ["XS", "S", "M"],
    alt: "Blue floral summer dress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMhiR_ztn2zPxQm2WTmqfcQh8W7tEOd9nMx1EiXvcjLfTRk5HWV58n54HmF3qfcsfu3tdM6gbSg981IlW19-CLh0K6oOZE7AgukzWbpSM_X8__h-bSXD_Q4iq2rDk0j3ncniBfqLKoy-EQYKnmbgsgwKi9XyZ9mffprLG7Al0F37tJCE4F9VPhoA2E5EWpvJPr8X_SmJppEI0YCXWaZUusFGGca3tr7ZtiL-MtWyTfo4JKeXo2XNmoWq1bG3NxV5ooHeXWYIUWMGWg",
  },
  {
    id: 2,
    brand: "Chic Threads",
    name: "Linen Midi Dress",
    price: 95.0,
    category: "mujer",
    colors: ["white"],
    sizes: ["S", "M", "L"],
    alt: "White linen summer dress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZtMD6TEdP7ITSqoCsFSuxgUSxlzpMiaa0REwOLpAxLH2t0RDjTEnnqaDyPWIn8bS1P8WHzDXH-0sQHsv5KK4r2JL_FtoICNfrVEaiI0sgg-MdX-8reTM-jsumoK54JAoA-z6uqxGQnLyc5H6rXyhdFOI4xl6YDtbdEpO3i_3aLndQ388B455pc57IQ4GbON3SoUvWCvlch38BBweLy3mKYp7FAMMREaSfSdmFv5VB3Krfm2xPcDrJXNCOMViJEHYNvoe-5pbG0DiB",
  },
  {
    id: 3,
    brand: "Modern Fit",
    name: "Sunshine Mini Dress",
    price: 68.5,
    category: "mujer",
    colors: ["yellow"],
    sizes: ["XS", "S", "M", "L"],
    alt: "Yellow patterned summer dress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqr8mN6sLU_NJrvnoog-LgN4KUhv4aCcSV8ESsZbI4iI6eXPDVPMmN0efdURxKFTlL3sHKOSYMTnB2maHyyda70OkAvgD7zGNeec-mhQLr3Eu0vbCxqYCLiFOsbnU0EtHs4314bqHwqJOlg64YhBgCnGAllppoHWnIRwrlVmTM6XgHqboNwOqnpjHByhb7nP7YDbS2NDew7Ga55FaKOYkoua9XGO7ulPXiCLR0NJI5GoIphCBVjcwbBr1Xs6WoQCTT0qJczFFNX7QN",
  },
  {
    id: 4,
    brand: "Aura",
    name: "Crimson Wrap Dress",
    price: 110.0,
    category: "mujer",
    colors: ["red"],
    sizes: ["S", "M", "L"],
    alt: "Red wrap dress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVRLpR8JwkfftEzJI0H6OUqQNfwIYiKu0Tl6epz87txfViAszKdWITMi7xz24G02lBNwhM98t-r-ATh2diEWNM3KAf4VwK9VjZon4N8dHUPpZ8LpKuaU4Y45s-5DkR-s48ydT6-JQSC-6kAF9C3nh-2tClyl9EuFVxie_Ly2dqHkOEGbN09jk91RYG1K7tCLjeVBmJlqcNdupqVf8Aa9XPP4vcoXNdeRfFlulr7ldyAbG_KPv1w6N2WoHQq0hFqeqDewFzfg28CW-r",
  },
  {
    id: 5,
    brand: "Chic Threads",
    name: "Emerald Green Sundress",
    price: 89.0,
    category: "mujer",
    colors: ["green"],
    sizes: ["XS", "S", "M"],
    alt: "Green sleeveless summer dress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDel6wynpwRxn_Qfzx35-zAJWWuUuJpsBLGUJ5Ppsm_HPMPQ6QCjTt4kmGtrE1DizrsD3ha3-OwqAbwNBQD2N2zsGmNtHYyC6kdswptV4Rib1c9SGLQqqd891RrM--nsoIyR-T9OK74-dgkoctZPJaAiJko_BlmR0Pm_wIZ4jw3h8ZWk__JmYzw0NfpUgQp0HNBGMoPiFhzwKdzJoccaxg0Pfc6ip400VczXFd51QtIVR77TZKAji1F97Uzv98GZqttTkh9bKEDjOhb",
  },
  {
    id: 6,
    brand: "Modern Fit",
    name: "Striped T-Shirt Dress",
    price: 55.99,
    category: "mujer",
    colors: ["black"],
    sizes: ["S", "M", "L", "XL"],
    alt: "Black and white striped dress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5yxQMI81ojnHvq6Y8uLJrs88GVwSvzi4dgH_K9NvELbMckzdxWIQSSxHFL6EZ_ML-77tNZA9mIA_80LI1XE2qHbV0hEpB1rKm5DPI-xqUVZK2tOcBzJrs48TRkTzAJsg3sHJ8J1j-_Qt7dC1NM1etp0bv55losRfijHe77nONALAms199JRTdJg8of5JvUZHwPlVCouwaDxS7SBxji5BNWpwmyAD2WVb1wSu_1cfo3udiX5T-CxUALt_NdbUvgFYDMEaNJnaCUqEl",
  },
  // puedes duplicar/crear más productos para probar paginación
];

const sizes = ["XS", "S", "M", "L", "XL"];

const colors = [
  { key: "blue", label: "Blue", hex: "#3b82f6" },
  { key: "red", label: "Red", hex: "#ef4444" },
  { key: "green", label: "Green", hex: "#22c55e" },
  { key: "yellow", label: "Yellow", hex: "#facc15" },
  { key: "purple", label: "Purple", hex: "#a855f7" },
  { key: "black", label: "Black", hex: "#111827" },
  { key: "white", label: "White", hex: "#ffffff" },
];

const brands = ["Aura", "Chic Threads", "Modern Fit"];

/** ---- route sync ---- */
function qStr(v) {
  return typeof v === "string" ? v : "";
}
function qNum(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function qArr(v) {
  if (typeof v !== "string" || !v.trim()) return [];
  return v.split(",").map((x) => x.trim()).filter(Boolean);
}

watch(
  () => route.query,
  (query) => {
    q.value = qStr(query.q);
    selectedSize.value = qStr(query.size);
    selectedColor.value = qStr(query.color);
    selectedBrands.value = qArr(query.brands);
    sort.value = qStr(query.sort) || "relevant";
    priceMin.value = qNum(query.min, 50);
    priceMax.value = qNum(query.max, 500);
    page.value = Math.max(1, qNum(query.page, 1));
  },
  { immediate: true }
);

function replaceQuery(next) {
  const merged = { ...route.query, ...next };

  // limpia vacíos
  Object.keys(merged).forEach((k) => {
    const v = merged[k];
    const emptyArray = Array.isArray(v) && v.length === 0;
    const emptyString = v === "" || v === null || v === undefined;
    if (emptyArray || emptyString) delete merged[k];
  });

  router.replace({ path: "/buscar", query: merged });
}

/** ---- filtering ---- */
const categoriaKey = computed(() => qStr(route.query.categoria));
const categoriaTitle = computed(() => {
  const k = categoriaKey.value;
  if (!k) return "";
  if (k === "hombre") return "Men";
  if (k === "mujer") return "Women";
  if (k === "ninos") return "Kids";
  if (k === "ofertas") return "Sale";
  return k;
});

const filteredProducts = computed(() => {
  const needle = q.value.trim().toLowerCase();
  const cat = categoriaKey.value;

  let list = products.filter((p) => {
    const matchesQuery =
      !needle ||
      p.name.toLowerCase().includes(needle) ||
      p.brand.toLowerCase().includes(needle);

    const matchesCat = !cat || p.category === cat;

    const matchesSize = !selectedSize.value || p.sizes.includes(selectedSize.value);

    const matchesColor =
      !selectedColor.value || p.colors.includes(selectedColor.value);

    const matchesBrand =
      selectedBrands.value.length === 0 || selectedBrands.value.includes(p.brand);

    const matchesPrice = p.price >= priceMin.value && p.price <= priceMax.value;

    return matchesQuery && matchesCat && matchesSize && matchesColor && matchesBrand && matchesPrice;
  });

  if (sort.value === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort.value === "price_desc") list = [...list].sort((a, b) => b.price - a.price);

  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)));

const pagedProducts = computed(() => {
  const start = (page.value - 1) * perPage;
  return filteredProducts.value.slice(start, start + perPage);
});

const pageNumbers = computed(() => {
  const max = totalPages.value;
  // simple: muestra hasta 8 páginas
  const arr = [];
  for (let i = 1; i <= Math.min(max, 8); i++) arr.push(i);
  return arr;
});

/** ---- chips ---- */
const activeChips = computed(() => {
  const chips = [];
  if (selectedSize.value) chips.push({ key: "size", label: `Size: ${selectedSize.value}` });
  if (selectedColor.value) {
    const c = colors.find((x) => x.key === selectedColor.value);
    chips.push({ key: "color", label: `Color: ${c?.label || selectedColor.value}` });
  }
  if (selectedBrands.value.length) {
    chips.push({ key: "brands", label: `Brand: ${selectedBrands.value.join(", ")}` });
  }
  return chips;
});

function removeChip(key) {
  if (key === "size") selectedSize.value = "";
  if (key === "color") selectedColor.value = "";
  if (key === "brands") selectedBrands.value = [];
  applyFilters();
}

/** ---- UI actions ---- */
function applySearch() {
  replaceQuery({ q: q.value, page: 1 });
}

function applyFilters() {
  // normaliza rango
  if (priceMin.value > priceMax.value) {
    const tmp = priceMin.value;
    priceMin.value = priceMax.value;
    priceMax.value = tmp;
  }

  replaceQuery({
    q: q.value || "",
    size: selectedSize.value || "",
    color: selectedColor.value || "",
    brands: selectedBrands.value.length ? selectedBrands.value.join(",") : "",
    sort: sort.value !== "relevant" ? sort.value : "",
    min: priceMin.value !== 50 ? String(priceMin.value) : "",
    max: priceMax.value !== 500 ? String(priceMax.value) : "",
    page: 1,
  });
}

function applyFiltersAndCloseMobile() {
  applyFilters();
  mobileFiltersOpen.value = false;
}

function clearAll() {
  selectedSize.value = "";
  selectedColor.value = "";
  selectedBrands.value = [];
  sort.value = "relevant";
  priceMin.value = 50;
  priceMax.value = 500;
  replaceQuery({ size: "", color: "", brands: "", sort: "", min: "", max: "", page: 1 });
}

function toggleSize(s) {
  selectedSize.value = selectedSize.value === s ? "" : s;
  applyFilters();
}

function toggleColor(c) {
  selectedColor.value = selectedColor.value === c ? "" : c;
  applyFilters();
}

function setPage(n) {
  const next = Math.min(totalPages.value, Math.max(1, n));
  page.value = next;
  replaceQuery({ page: String(next) });
}

function goProduct(id) {
  router.push(`/producto/${id}`);
}

function addToCart(p) {
  // placeholder (luego: store + API)
  console.log("addToCart", p);
}

const rangeFillStyle = computed(() => {
  const min = Math.min(priceMin.value, priceMax.value);
  const max = Math.max(priceMin.value, priceMax.value);
  const left = (min / 500) * 100;
  const width = ((max - min) / 500) * 100;
  return { left: `${left}%`, width: `${width}%` };
});
</script>

<style scoped>
/* header extras */
.actions { display:flex; gap:8px; align-items:center; }
.brand { display:flex; align-items:center; gap:14px; }
.brand__logo { color: var(--primary); width: 26px; height: 26px; display:grid; place-items:center; }
.brand__name { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }

.headerSearch {
  display: none;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  background: rgba(148,163,184,.18);
  border: 1px solid var(--border);
}
.headerSearch__icon { color: var(--muted); font-size: 20px; }
.headerSearch__input {
  border: 0; outline: 0; background: transparent;
  color: var(--text); width: 220px; font-size: 14px;
}
@media (min-width: 768px) {
  .headerSearch { display: flex; }
}
.avatar {
  width: 40px; height: 40px; border-radius: 999px;
  overflow: hidden; border: 1px solid var(--border);
}
.avatar img { width:100%; height:100%; object-fit: cover; display:block; }
.iconbtn--filters { display: inline-grid; }
@media (min-width: 1024px) {
  .iconbtn--filters { display:none; }
}

/* page layout */
.searchPage { padding: 18px 0 40px; }

.breadcrumbs {
  display: flex; flex-wrap: wrap; gap: 8px;
  color: var(--muted);
  padding: 10px 0 14px;
}
.breadcrumbs__link { color: var(--muted); font-weight: 700; }
.breadcrumbs__link:hover { color: var(--primary); }
.breadcrumbs__sep { color: var(--muted); }
.breadcrumbs__current { color: var(--text); font-weight: 800; }

.heading { padding: 10px 0 10px; }
.heading__title {
  margin: 0;
  font-size: clamp(26px, 3vw, 42px);
  font-weight: 950;
  letter-spacing: -0.03em;
}
.heading__q { color: var(--primary); }
.heading__sub { margin: 8px 0 0; color: var(--muted); }

.layout { display: grid; gap: 18px; }
@media (min-width: 1024px) {
  .layout { grid-template-columns: 320px 1fr; gap: 22px; }
}

/* sidebar */
.sidebar { position: relative; }
.sidebarCard {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
}
.sidebarTop {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom: 12px;
}
.sidebarTitle { margin:0; font-size: 18px; font-weight: 900; }
.linkBtn {
  border: 0; background: transparent; cursor: pointer;
  color: var(--primary); font-weight: 800;
}
.linkBtn:hover { text-decoration: underline; }

.filters { display:grid; gap: 18px; }
.filterBlock { display:grid; gap: 10px; }
.filterTitle { font-weight: 900; }

.sizeGrid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.sizeBtn {
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-weight: 900;
  cursor: pointer;
}
.sizeBtn:hover { background: rgba(148,163,184,.15); }
.sizeBtn--active { background: var(--primary); color: #fff; border-color: var(--primary); }

.colorRow { display:flex; flex-wrap:wrap; gap: 10px; }
.colorDot {
  width: 32px; height: 32px; border-radius: 999px;
  border: 1px solid var(--border);
  cursor: pointer;
}
.colorDot--active { outline: 3px solid rgba(19,127,236,.45); outline-offset: 2px; }

.rangeWrap { position: relative; padding-top: 8px; }
.rangeTrack {
  height: 6px;
  background: rgba(148,163,184,.25);
  border-radius: 999px;
  position: relative;
}
.rangeFill {
  height: 6px;
  background: var(--primary);
  border-radius: 999px;
  position: absolute;
  top: 0;
}
.rangeInput {
  position: absolute;
  left: 0; right: 0;
  top: 0;
  width: 100%;
  background: transparent;
  pointer-events: none;
  appearance: none;
  height: 30px;
}
.rangeInput::-webkit-slider-thumb {
  pointer-events: all;
  appearance: none;
  width: 16px; height: 16px;
  border-radius: 999px;
  background: #fff;
  border: 2px solid var(--primary);
}
.rangeValues {
  margin-top: 10px;
  display:flex; justify-content:space-between;
  color: var(--muted); font-weight: 800;
}

.brandList { display:grid; gap: 10px; }
.checkRow { display:flex; align-items:center; gap: 10px; color: var(--text); font-weight: 700; }
.checkRow input { width: 16px; height: 16px; accent-color: var(--primary); }

.sidebarBottom { margin-top: 16px; display:grid; gap: 10px; }
.w100 { width: 100%; }
.btn-ghost {
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-weight: 900;
  cursor: pointer;
}
.btn-ghost:hover { background: rgba(148,163,184,.15); }

/* mobile sidebar overlay */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
  }
  .sidebarCard {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: min(420px, 92vw);
    border-radius: 0;
    overflow: auto;
    transform: translateX(105%);
    transition: transform .25s ease;
    pointer-events: all;
  }
  .sidebar--open .sidebarCard { transform: translateX(0); }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,.35);
    pointer-events: all;
  }
}

/* chips */
.chips {
  display:flex; flex-wrap:wrap; gap: 10px;
  padding: 10px 0 14px;
  border-bottom: 1px solid var(--border);
}
.chip {
  height: 34px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(148,163,184,.16);
  padding: 0 10px;
  display:flex; align-items:center; gap: 8px;
}
.chip--select { padding-right: 8px; }
.chipSelect {
  border: 0;
  background: transparent;
  color: var(--text);
  font-weight: 900;
  outline: none;
  cursor: pointer;
}
.chip--active {
  background: rgba(19,127,236,.16);
  border-color: rgba(19,127,236,.35);
  color: var(--primary);
  cursor: pointer;
}
.chip__text { font-weight: 900; font-size: 13px; }
.chip__x { font-size: 18px; }

/* product grid */
.productGrid {
  padding: 18px 0 0;
  display:grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .productGrid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1280px) {
  .productGrid { grid-template-columns: repeat(3, 1fr); }
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s ease;
}
.card:hover { transform: translateY(-2px); }
.card__imgWrap { position: relative; aspect-ratio: 1/1; background: rgba(148,163,184,.15); }
.card__img { width: 100%; height: 100%; object-fit: cover; display:block; }
.card__body { padding: 14px; display:grid; gap: 6px; }
.card__brand { color: var(--muted); font-weight: 800; font-size: 13px; }
.card__name { font-weight: 950; }
.card__price { font-weight: 950; color: var(--primary); font-size: 18px; }

.bagBtn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 0;
  background: var(--primary);
  color: #fff;
  display:grid;
  place-items:center;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .2s ease, transform .2s ease;
  cursor: pointer;
}
.card:hover .bagBtn {
  opacity: 1;
  transform: translateY(0);
}

.empty {
  grid-column: 1 / -1;
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed var(--border);
  color: var(--muted);
  font-weight: 800;
}

/* pagination */
.pagination {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  display:flex;
  gap: 10px;
  justify-content: center;
  align-items:center;
  flex-wrap: wrap;
}
.pageBtn {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 900;
  cursor: pointer;
}
.pageBtn:disabled { opacity: .5; cursor: not-allowed; }
.pageBtn:hover:not(:disabled) { background: rgba(148,163,184,.15); }

.pageNums { display:flex; gap: 6px; }
.pageNum {
  width: 40px; height: 40px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  font-weight: 950;
  cursor:pointer;
}
.pageNum:hover { color: var(--primary); }
.pageNum--active {
  background: rgba(19,127,236,.16);
  color: var(--primary);
  border-color: rgba(19,127,236,.35);
}

/* material icons */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
