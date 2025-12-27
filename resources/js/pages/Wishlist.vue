<template>
  <div class="page">
    <!-- Header -->
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
        </div>

        <nav class="nav" aria-label="Categorías">
          <router-link :to="{ path: '/buscar', query: { categoria: 'hombre' } }">Hombre</router-link>
          <router-link :to="{ path: '/buscar', query: { categoria: 'mujer' } }">Mujer</router-link>
          <router-link :to="{ path: '/buscar', query: { categoria: 'ninos' } }">Niños</router-link>
          <router-link :to="{ path: '/buscar', query: { categoria: 'ofertas' } }">Ofertas</router-link>
        </nav>

        <div class="actions">
          <router-link class="iconbtn" to="/buscar" aria-label="Buscar">
            <span class="material-symbols-outlined">search</span>
          </router-link>
          <router-link class="iconbtn" to="/carrito" aria-label="Carrito">
            <span class="material-symbols-outlined">shopping_bag</span>
          </router-link>
          <router-link class="iconbtn" to="/login" aria-label="Cuenta">
            <span class="material-symbols-outlined">person</span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="container main">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <router-link class="breadcrumbs__link" to="/">Inicio</router-link>
        <span class="breadcrumbs__sep">/</span>
        <span class="breadcrumbs__current">Wishlist</span>
      </nav>

      <div class="topRow">
        <div>
          <h1 class="title">Lista de deseos</h1>
          <p class="subtitle" v-if="items.length">
            Guardados: <strong>{{ items.length }}</strong> {{ items.length === 1 ? "producto" : "productos" }}
          </p>
          <p class="subtitle" v-else>
            Aún no has guardado ningún producto.
          </p>
        </div>

        <div class="topActions" v-if="items.length">
          <button class="btn-ghost" type="button" @click="clearWishlist">
            Vaciar lista
          </button>
          <button class="btn-ghost" type="button" @click="$router.push('/buscar')">
            Buscar productos
          </button>
        </div>
      </div>

      <!-- Empty -->
      <section v-if="items.length === 0" class="emptyCard">
        <div class="emptyIcon material-symbols-outlined" aria-hidden="true">favorite</div>
        <h2 class="emptyTitle">Tu wishlist está vacía</h2>
        <p class="emptyText">Guarda productos para verlos aquí y comprar cuando quieras.</p>
        <div class="emptyActions">
          <button class="btn-primary" type="button" @click="$router.push('/buscar')">Ir a buscar</button>
          <button class="btn-ghost" type="button" @click="$router.push('/')">Volver a Home</button>
        </div>
      </section>

      <!-- Grid -->
      <section v-else class="grid">
        <article v-for="p in items" :key="p.key" class="card">
          <button class="imgBtn" type="button" @click="goProduct(p.productId)">
            <img class="img" :src="p.image" :alt="p.name" loading="lazy" />
          </button>

          <div class="body">
            <div class="brandLine">
              <span class="brandText">{{ p.brand }}</span>
              <span class="badge" v-if="p.tag">{{ p.tag }}</span>
            </div>

            <button class="name" type="button" @click="goProduct(p.productId)">
              {{ p.name }}
            </button>

            <div class="meta">
              <span>Color: <strong>{{ p.colorLabel }}</strong></span>
              <span class="dot">•</span>
              <span>Talla: <strong>{{ p.size }}</strong></span>
            </div>

            <div class="bottom">
              <div class="price">{{ formatPrice(p.price) }}</div>

              <div class="btnRow">
                <button class="btn-primary btnSmall" type="button" @click="moveToCart(p)">
                  <span class="material-symbols-outlined">shopping_bag</span>
                  <span>Añadir</span>
                </button>

                <button class="btn-ghost btnIcon" type="button" @click="remove(p.key)" aria-label="Eliminar">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const WISHLIST_KEY = "urbano_wishlist";
const CART_KEY = "urbano_cart";

/** Seed para demo */
const SEED = [
  {
    key: "2|forest|S",
    productId: "2",
    brand: "Elegancia Urbana",
    name: "Vestido Midi de Lino con Cinturón",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCmh5Gv7W9wGLPX0obscl2Rrx6IMk6xRPEk-Zgy5fR8iGfPffANJaMLNRKKzMpFnAd4EW7oz593gO_eEMmiktDr9dsMLbk3GY9MjFu-RQAt8DtuG2-wVIN0OHZl6d8ArzICQDpjIko5iB_Kb8kAToFm_y33b7S1RXp81gT8k9pa9bb-E53IdSQhdMyTiIpXKSoa0D3UvxgbfOBOeOs8e3g-QLbm13NHxagblTgVJK45Z0W-1Ajv0H6HNNSgqGGjLB8KmNeDCxBwCZ",
    price: 89.99,
    colorKey: "forest",
    colorLabel: "Verde Bosque",
    size: "S",
    tag: "Nuevo",
  },
  {
    key: "1|black|M",
    productId: "1",
    brand: "Urbano",
    name: "Chaqueta Denim Clásica",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
    price: 59.99,
    colorKey: "black",
    colorLabel: "Negro",
    size: "M",
    tag: "Top",
  },
];

const items = ref(loadWishlist());

function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(SEED));
      return [...SEED];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishlist() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items.value));
}

watchEffect(() => {
  saveWishlist();
});

function formatPrice(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function goProduct(id) {
  router.push(`/producto/${id}`);
}

function remove(key) {
  items.value = items.value.filter((x) => x.key !== key);
}

function clearWishlist() {
  items.value = [];
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function moveToCart(p) {
  const cart = loadCart();

  // key de carrito: producto+color+talla
  const cartKey = `${p.productId}|${p.colorKey}|${p.size}`;
  const existing = cart.find((x) => x.key === cartKey);

  if (existing) existing.qty += 1;
  else {
    cart.push({
      key: cartKey,
      productId: p.productId,
      brand: p.brand,
      name: p.name,
      image: p.image,
      price: p.price,
      colorKey: p.colorKey,
      colorLabel: p.colorLabel,
      size: p.size,
      qty: 1,
    });
  }

  saveCart(cart);
  remove(p.key);
  router.push("/carrito");
}
</script>

<style scoped>
/* header bits */
.actions { display:flex; gap:8px; align-items:center; }
.brand { display:flex; align-items:center; gap:10px; }
.brand__logo { color: var(--primary); width: 26px; height: 26px; display:grid; place-items:center; }
.brand__name { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }

/* layout */
.main { padding: 18px 0 52px; }
.breadcrumbs {
  display: flex; flex-wrap: wrap; gap: 8px;
  color: var(--muted);
  padding: 10px 0 18px;
}
.breadcrumbs__link { color: var(--muted); font-weight: 800; }
.breadcrumbs__link:hover { color: var(--primary); }
.breadcrumbs__sep { color: var(--muted); }
.breadcrumbs__current { color: var(--text); font-weight: 950; }

.topRow {
  display:flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}
.title {
  margin: 0;
  font-size: clamp(28px, 3vw, 42px);
  font-weight: 950;
  letter-spacing: -0.03em;
}
.subtitle { margin: 8px 0 0; color: var(--muted); }
.topActions { display:flex; gap: 10px; flex-wrap: wrap; }

/* grid cards */
.grid {
  margin-top: 18px;
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
}

.imgBtn {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}
.img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  background: rgba(148,163,184,.12);
}

.body { padding: 14px; display:grid; gap: 8px; }
.brandLine { display:flex; justify-content: space-between; gap: 10px; align-items:center; }
.brandText { color: var(--muted); font-weight: 900; font-size: 13px; }

.badge {
  font-size: 12px;
  font-weight: 950;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(19,127,236,.25);
  background: rgba(19,127,236,.08);
  color: var(--primary);
}

.name {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font-weight: 950;
  color: var(--text);
  line-height: 1.2;
}
.name:hover { color: var(--primary); }

.meta { color: var(--muted); font-weight: 800; font-size: 13px; }
.dot { margin: 0 6px; }

.bottom {
  margin-top: 8px;
  display:flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.price { font-weight: 950; font-size: 18px; white-space: nowrap; }

.btnRow { display:flex; gap: 10px; align-items:center; }
.btnSmall { height: 42px; padding: 0 14px; }
.btnIcon { width: 44px; height: 42px; display:grid; place-items:center; padding: 0; }

/* buttons */
.btn-ghost {
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 950;
  cursor: pointer;
  padding: 0 14px;
}
.btn-ghost:hover { background: rgba(148,163,184,.12); }

.btn-primary {
  height: 48px;
  border: 0;
  padding: 0 16px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.btn-primary:hover { filter: brightness(.95); }

/* empty state */
.emptyCard {
  margin-top: 20px;
  padding: 22px;
  border-radius: 16px;
  border: 1px dashed var(--border);
  background: var(--card);
  text-align: center;
}
.emptyIcon { font-size: 48px; color: var(--primary); }
.emptyTitle { margin: 10px 0 0; font-size: 22px; font-weight: 950; }
.emptyText { margin: 10px 0 0; color: var(--muted); }
.emptyActions { margin-top: 14px; display:flex; justify-content: center; gap: 10px; flex-wrap: wrap; }

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
