<template>
  <div class="page">
    <!-- Header minimal -->
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

        <div class="actions">
          <router-link class="iconbtn" to="/buscar" aria-label="Buscar">
            <span class="material-symbols-outlined">search</span>
          </router-link>
          <router-link class="iconbtn" to="/wishlist" aria-label="Wishlist">
            <span class="material-symbols-outlined">favorite</span>
          </router-link>
          <router-link class="iconbtn" to="/carrito" aria-label="Carrito">
            <span class="material-symbols-outlined">shopping_bag</span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="container main">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <router-link class="breadcrumbs__link" to="/">Inicio</router-link>
        <span class="breadcrumbs__sep">/</span>
        <span class="breadcrumbs__current">404</span>
      </nav>

      <section class="hero">
        <div class="hero__left">
          <div class="code">404</div>
          <h1 class="title">Ups… esta página no existe</h1>
          <p class="subtitle">
            Puede que el enlace esté mal, que el producto ya no esté disponible o que la página se haya movido.
          </p>

          <div class="cta">
            <button class="btn-primary" type="button" @click="$router.push('/')">
              <span class="material-symbols-outlined">home</span>
              <span>Volver a inicio</span>
            </button>

            <button class="btn-ghost" type="button" @click="$router.back()">
              <span class="material-symbols-outlined">arrow_back</span>
              <span>Atrás</span>
            </button>

            <button class="btn-ghost" type="button" @click="$router.push('/buscar')">
              <span class="material-symbols-outlined">search</span>
              <span>Buscar</span>
            </button>
          </div>

          <div class="searchCard">
            <div class="searchTitle">Encuentra lo que buscabas</div>
            <div class="searchBox">
              <span class="material-symbols-outlined searchIcon">search</span>
              <input
                v-model.trim="q"
                class="searchInput"
                type="text"
                placeholder="Buscar productos, marcas, referencias…"
                @keyup.enter="goSearch"
              />
              <button class="btn-primary btnSmall" type="button" @click="goSearch" :disabled="!q">
                Buscar
              </button>
            </div>

            <div class="chips" aria-label="Categorías rápidas">
              <button class="chip" type="button" @click="goCat('hombre')">Hombre</button>
              <button class="chip" type="button" @click="goCat('mujer')">Mujer</button>
              <button class="chip" type="button" @click="goCat('ninos')">Niños</button>
              <button class="chip" type="button" @click="goCat('ofertas')">Ofertas</button>
            </div>
          </div>
        </div>

        <div class="hero__right" aria-hidden="true">
          <div class="blob">
            <div class="icon material-symbols-outlined">local_mall</div>
          </div>

          <div class="tip">
            <div class="tip__title">Consejo rápido</div>
            <div class="tip__text">
              Si estabas buscando un producto, prueba a entrar desde <strong>Buscar</strong> o filtra por categoría.
            </div>
          </div>

          <div class="miniLinks">
            <router-link class="miniLink" to="/carrito">
              <span class="material-symbols-outlined">shopping_bag</span>
              <span>Ir al carrito</span>
            </router-link>
            <router-link class="miniLink" to="/wishlist">
              <span class="material-symbols-outlined">favorite</span>
              <span>Ver wishlist</span>
            </router-link>
            <router-link class="miniLink" to="/orders">
              <span class="material-symbols-outlined">receipt_long</span>
              <span>Mis pedidos</span>
            </router-link>
          </div>
        </div>
      </section>

      <section class="debug" v-if="showDebug">
        <div class="debugCard">
          <div class="debugTitle">Información (debug)</div>
          <div class="debugText">
            Ruta: <strong>{{ currentPath }}</strong>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const q = ref("");

const currentPath = computed(() => route.fullPath || "/");
const showDebug = false; // ponlo a true si queréis ver la ruta durante desarrollo

function goSearch() {
  if (!q.value) return;
  router.push({ path: "/buscar", query: { q: q.value } });
}

function goCat(cat) {
  router.push({ path: "/buscar", query: { categoria: cat } });
}
</script>

<style scoped>
/* header bits */
.actions { display:flex; gap:8px; align-items:center; }
.brand { display:flex; align-items:center; gap:10px; }
.brand__logo { color: var(--primary); width: 26px; height: 26px; display:grid; place-items:center; }
.brand__name { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }

/* layout */
.main { padding: 18px 0 60px; }

.breadcrumbs {
  display: flex; flex-wrap: wrap; gap: 8px;
  color: var(--muted);
  padding: 10px 0 18px;
}
.breadcrumbs__link { color: var(--muted); font-weight: 800; }
.breadcrumbs__link:hover { color: var(--primary); }
.breadcrumbs__sep { color: var(--muted); }
.breadcrumbs__current { color: var(--text); font-weight: 950; }

.hero {
  display: grid;
  gap: 18px;
  align-items: start;
}
@media (min-width: 1024px) {
  .hero { grid-template-columns: 1.15fr 0.85fr; gap: 22px; }
}

.hero__left, .hero__right { display: grid; gap: 14px; }

.code {
  width: fit-content;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(19,127,236,.25);
  background: rgba(19,127,236,.08);
  color: var(--primary);
  font-weight: 950;
  letter-spacing: .08em;
}

.title {
  margin: 0;
  font-size: clamp(30px, 3.2vw, 52px);
  font-weight: 950;
  letter-spacing: -0.03em;
}
.subtitle {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
  font-weight: 700;
  max-width: 62ch;
}

.cta { display:flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }

.searchCard {
  margin-top: 8px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 12px;
}
.searchTitle { font-weight: 950; }

.searchBox {
  height: 46px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(148,163,184,.14);
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 0 12px;
}
.searchIcon { color: var(--muted); }
.searchInput {
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  width: 100%;
  font-weight: 800;
}

.chips { display:flex; gap: 10px; flex-wrap: wrap; }
.chip {
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(148,163,184,.10);
  color: var(--text);
  font-weight: 900;
  cursor: pointer;
}
.chip:hover { border-color: rgba(19,127,236,.35); background: rgba(19,127,236,.08); color: var(--primary); }

/* right */
.blob {
  border-radius: 22px;
  border: 1px solid rgba(19,127,236,.25);
  background: radial-gradient(circle at 30% 20%, rgba(19,127,236,.20), transparent 60%),
              radial-gradient(circle at 70% 70%, rgba(148,163,184,.18), transparent 60%),
              rgba(148,163,184,.10);
  height: 260px;
  display:grid;
  place-items:center;
}
.icon {
  width: 92px;
  height: 92px;
  border-radius: 999px;
  display:grid;
  place-items:center;
  background: rgba(19,127,236,.12);
  border: 1px solid rgba(19,127,236,.25);
  color: var(--primary);
  font-size: 42px;
}

.tip {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
}
.tip__title { font-weight: 950; }
.tip__text { margin-top: 8px; color: var(--muted); font-weight: 800; line-height: 1.6; }

.miniLinks { display:grid; gap: 10px; }
.miniLink {
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 950;
}
.miniLink:hover { border-color: rgba(19,127,236,.35); color: var(--primary); }
.miniLink .material-symbols-outlined { margin-right: 10px; }

/* buttons */
.btn-ghost {
  height: 46px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 950;
  cursor: pointer;
  padding: 0 14px;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.btn-ghost:hover { background: rgba(148,163,184,.12); }

.btn-primary {
  height: 46px;
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
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.btnSmall { height: 40px; padding: 0 14px; }

/* debug */
.debugCard {
  margin-top: 18px;
  border-radius: 16px;
  border: 1px dashed var(--border);
  background: var(--card);
  padding: 14px;
}
.debugTitle { font-weight: 950; }
.debugText { margin-top: 8px; color: var(--muted); font-weight: 800; }

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
