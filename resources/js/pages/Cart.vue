<template>
  <div class="page">
    <!-- Header simple -->
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
          <router-link class="iconbtn" to="/wishlist" aria-label="Wishlist">
            <span class="material-symbols-outlined">favorite</span>
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
        <span class="breadcrumbs__current">Carrito</span>
      </nav>

      <div class="topRow">
        <div>
          <h1 class="title">Tu carrito</h1>
          <p class="subtitle" v-if="itemsCount > 0">
            Tienes <strong>{{ itemsCount }}</strong> {{ itemsCount === 1 ? "artículo" : "artículos" }} en el carrito.
          </p>
          <p class="subtitle" v-else>
            Tu carrito está vacío. Encuentra algo que te encante.
          </p>
        </div>

        <div class="topActions" v-if="itemsCount > 0">
          <button class="btn-ghost" type="button" @click="clearCart">
            Vaciar carrito
          </button>
          <button class="btn-ghost" type="button" @click="$router.push('/buscar')">
            Seguir comprando
          </button>
        </div>
      </div>

      <div class="layout" v-if="items.length > 0">
        <!-- Items -->
        <section class="items">
          <article v-for="it in items" :key="it.key" class="item">
            <button class="item__imgBtn" type="button" @click="goToProduct(it.productId)">
              <img class="item__img" :src="it.image" :alt="it.name" loading="lazy" />
            </button>

            <div class="item__info">
              <div class="item__top">
                <div>
                  <div class="item__brand">{{ it.brand }}</div>
                  <button class="item__name" type="button" @click="goToProduct(it.productId)">
                    {{ it.name }}
                  </button>
                  <div class="item__meta">
                    <span>Color: <strong>{{ it.colorLabel }}</strong></span>
                    <span class="dot">•</span>
                    <span>Talla: <strong>{{ it.size }}</strong></span>
                  </div>
                </div>

                <div class="item__price">
                  {{ formatPrice(it.price) }}
                </div>
              </div>

              <div class="item__bottom">
                <div class="qty">
                  <button class="qtyBtn" type="button" @click="decQty(it)" :disabled="it.qty <= 1">−</button>
                  <div class="qtyValue">{{ it.qty }}</div>
                  <button class="qtyBtn" type="button" @click="incQty(it)">+</button>
                </div>

                <div class="item__actions">
                  <button class="linkBtn" type="button" @click="moveToWishlist(it)">
                    Mover a favoritos
                  </button>
                  <button class="linkBtn linkBtn--danger" type="button" @click="removeItem(it.key)">
                    Eliminar
                  </button>
                </div>

                <div class="item__lineTotal">
                  Total: <strong>{{ formatPrice(it.price * it.qty) }}</strong>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- Summary -->
        <aside class="summary" aria-label="Resumen del pedido">
          <div class="summaryCard">
            <h2 class="summaryTitle">Resumen</h2>

            <div class="row">
              <span>Subtotal</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
            </div>

            <div class="row">
              <span>Envío</span>
              <strong>{{ shippingLabel }}</strong>
            </div>

            <div class="row row--total">
              <span>Total</span>
              <strong>{{ formatPrice(total) }}</strong>
            </div>

            <div class="divider"></div>

            <button class="btn-primary w100" type="button" @click="checkout">
              <span class="material-symbols-outlined">lock</span>
              <span>Continuar al pago</span>
            </button>

            <p class="note">
              Al continuar, aceptas las condiciones de compra. (TPVV y envío se integrarán más adelante)
            </p>
          </div>
        </aside>
      </div>

      <!-- Empty state -->
      <section v-else class="emptyCard">
        <div class="emptyIcon material-symbols-outlined" aria-hidden="true">shopping_bag</div>
        <h2 class="emptyTitle">Tu carrito está vacío</h2>
        <p class="emptyText">Explora el catálogo y añade productos para verlos aquí.</p>
        <div class="emptyActions">
          <button class="btn-primary" type="button" @click="$router.push('/buscar')">Ir a buscar</button>
          <button class="btn-ghost" type="button" @click="$router.push('/')">Volver a Home</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/**
 * Carrito persistente:
 * - localStorage key: "urbano_cart"
 * - cada item lleva un "key" único por combinación (producto + color + talla)
 */
const STORAGE_KEY = "urbano_cart";

/** ---- mock inicial para que se vea algo si está vacío ---- */
const SEED = [
  {
    key: "2|beige|M",
    productId: "2",
    brand: "Elegancia Urbana",
    name: "Vestido Midi de Lino con Cinturón",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCmh5Gv7W9wGLPX0obscl2Rrx6IMk6xRPEk-Zgy5fR8iGfPffANJaMLNRKKzMpFnAd4EW7oz593gO_eEMmiktDr9dsMLbk3GY9MjFu-RQAt8DtuG2-wVIN0OHZl6d8ArzICQDpjIko5iB_Kb8kAToFm_y33b7S1RXp81gT8k9pa9bb-E53IdSQhdMyTiIpXKSoa0D3UvxgbfOBOeOs8e3g-QLbm13NHxagblTgVJK45Z0W-1Ajv0H6HNNSgqGGjLB8KmNeDCxBwCZ",
    price: 89.99,
    colorKey: "beige",
    colorLabel: "Beige Natural",
    size: "M",
    qty: 1,
  },
  {
    key: "1|denim|L",
    productId: "1",
    brand: "Urbano",
    name: "Chaqueta Denim Clásica",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
    price: 59.99,
    colorKey: "denim",
    colorLabel: "Denim",
    size: "L",
    qty: 2,
  },
];

const items = ref(loadCart());

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // seed para que se vea bonito en demo
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return [...SEED];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
}

watchEffect(() => {
  saveCart();
});

/** ---- derived ---- */
const itemsCount = computed(() => items.value.reduce((acc, it) => acc + it.qty, 0));
const subtotal = computed(() => items.value.reduce((acc, it) => acc + it.price * it.qty, 0));

const shipping = computed(() => {
  // lógica simple:
  // - gratis si subtotal >= 80
  // - 4.99 si hay items
  if (items.value.length === 0) return 0;
  return subtotal.value >= 80 ? 0 : 4.99;
});

const shippingLabel = computed(() => (shipping.value === 0 ? "Gratis" : formatPrice(shipping.value)));
const total = computed(() => subtotal.value + shipping.value);

/** ---- actions ---- */
function formatPrice(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function goToProduct(id) {
  router.push(`/producto/${id}`);
}

function incQty(it) {
  it.qty += 1;
}
function decQty(it) {
  it.qty = Math.max(1, it.qty - 1);
}

function removeItem(key) {
  items.value = items.value.filter((x) => x.key !== key);
}

function clearCart() {
  items.value = [];
}

function moveToWishlist(it) {
  // placeholder (luego conectamos con backend o localStorage wishlist)
  console.log("MOVE_TO_WISHLIST", it);
  removeItem(it.key);
  router.push("/wishlist");
}

function checkout() {
  // placeholder: más adelante -> login + TPVV
  alert("Checkout: más adelante lo conectamos con login + TPVV 🙂");
}

</script>

<style scoped>
/* header bits */
.actions { display:flex; gap:8px; align-items:center; }
.brand { display:flex; align-items:center; gap:10px; }
.brand__logo { color: var(--primary); width: 26px; height: 26px; display:grid; place-items:center; }
.brand__name { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }

/* layout */
.main { padding: 18px 0 46px; }

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

.layout {
  margin-top: 18px;
  display: grid;
  gap: 18px;
}
@media (min-width: 1024px) {
  .layout { grid-template-columns: 1fr 360px; gap: 22px; align-items: start; }
}

/* items */
.items { display: grid; gap: 14px; }
.item {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--card);
}
@media (min-width: 640px) {
  .item { grid-template-columns: 140px 1fr; padding: 16px; gap: 16px; }
}
.item__imgBtn {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  border-radius: 14px;
  overflow: hidden;
  align-self: start;
}
.item__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
}
.item__info { display: grid; gap: 12px; }

.item__top {
  display:flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.item__brand { color: var(--muted); font-weight: 900; font-size: 13px; }
.item__name {
  display: inline-block;
  margin-top: 2px;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  color: var(--text);
  font-weight: 950;
  cursor: pointer;
}
.item__name:hover { color: var(--primary); }
.item__meta { margin-top: 6px; color: var(--muted); font-weight: 800; font-size: 13px; }
.dot { margin: 0 6px; }
.item__price { font-weight: 950; font-size: 18px; white-space: nowrap; }

.item__bottom {
  display:flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

/* qty */
.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--card);
}
.qtyBtn {
  width: 44px;
  height: 42px;
  border: 0;
  background: transparent;
  color: var(--text);
  font-weight: 950;
  cursor: pointer;
}
.qtyBtn:hover:not(:disabled) { background: rgba(148,163,184,.12); }
.qtyBtn:disabled { opacity: .5; cursor: not-allowed; }
.qtyValue { width: 54px; text-align: center; font-weight: 950; }

.item__actions { display:flex; gap: 10px; flex-wrap: wrap; }
.linkBtn {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--primary);
  font-weight: 900;
}
.linkBtn:hover { text-decoration: underline; }
.linkBtn--danger { color: #ef4444; }

.item__lineTotal { color: var(--muted); font-weight: 900; }

/* summary */
.summaryCard {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--card);
  position: sticky;
  top: 88px;
}
.summaryTitle { margin: 0 0 14px; font-size: 18px; font-weight: 950; }
.row {
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding: 10px 0;
  color: var(--muted);
  font-weight: 800;
}
.row strong { color: var(--text); }
.row--total { padding-top: 12px; font-size: 16px; }
.row--total strong { font-size: 18px; }
.divider { height: 1px; background: var(--border); margin: 10px 0 14px; }
.w100 { width: 100%; }

.note {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

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
