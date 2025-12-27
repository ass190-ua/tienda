<template>
  <div class="page">
    <!-- HEADER -->
    <header class="header">
      <div class="header__inner container">
        <div class="brand">
          <span class="brand__logo" aria-hidden="true">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.28 12.72-4.24-4.24c-.39-.39-1.02-.39-1.41 0L5.39 14.72c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.9l5.28 5.24c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.42z"
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
          <button class="iconbtn iconbtn--menu" type="button" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Menú">
            <span class="material-symbols-outlined">menu</span>
          </button>

          <router-link class="iconbtn" to="/buscar" aria-label="Buscar">
            <span class="material-symbols-outlined">search</span>
          </router-link>

          <router-link class="iconbtn" to="/login" aria-label="Cuenta">
            <span class="material-symbols-outlined">person</span>
          </router-link>

          <router-link class="iconbtn" to="/carrito" aria-label="Carrito">
            <span class="material-symbols-outlined">shopping_bag</span>
          </router-link>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="mobilemenu">
        <div class="container mobilemenu__inner">
          <router-link class="mobilemenu__item" :to="{ path: '/buscar', query: { categoria: 'hombre' } }" @click="closeMenu">
            Hombre
          </router-link>
          <router-link class="mobilemenu__item" :to="{ path: '/buscar', query: { categoria: 'mujer' } }" @click="closeMenu">
            Mujer
          </router-link>
          <router-link class="mobilemenu__item" :to="{ path: '/buscar', query: { categoria: 'ninos' } }" @click="closeMenu">
            Niños
          </router-link>
          <router-link class="mobilemenu__item" :to="{ path: '/buscar', query: { categoria: 'ofertas' } }" @click="closeMenu">
            Ofertas
          </router-link>
        </div>
      </div>
    </header>

    <!-- SEARCH -->
    <section class="searchbar">
      <div class="container">
        <form class="searchbar__box" @submit.prevent="onSearch">
          <div class="searchbar__icon" aria-hidden="true">
            <span class="material-symbols-outlined">search</span>
          </div>
          <input
            v-model="q"
            class="searchbar__input"
            placeholder="Buscar prendas, marcas..."
            autocomplete="off"
          />
        </form>
      </div>
    </section>

    <!-- HERO -->
    <section class="container">
      <div class="hero" :style="heroStyle" aria-label="Colección primavera/verano 26">
        <h1 class="hero__title">Colección primavera/verano 26</h1>
        <p class="hero__subtitle">Descubre las últimas tendencias y estilos para la nueva temporada.</p>

        <button class="btn-primary" type="button" @click="$router.push({ path: '/buscar', query: { destacados: '1' } })">
          Comprar ahora
        </button>
      </div>
    </section>

    <!-- FEATURED COLLECTIONS -->
    <section class="container">
      <h2 class="section-title">Colecciones Destacadas</h2>

      <div class="grid grid--collections">
        <button
          v-for="c in featuredCollections"
          :key="c.key"
          class="collection"
          type="button"
          :style="collectionBg(c.image)"
          @click="$router.push({ path: '/buscar', query: { coleccion: c.key } })"
        >
          <p class="collection__title">{{ c.title }}</p>
        </button>
      </div>
    </section>

    <!-- RECOMMENDED -->
    <section class="container">
      <h2 class="section-title">Te podría interesar</h2>

      <div class="grid grid--products">
        <button v-for="p in recommendedProducts" :key="p.id" class="product" type="button" @click="$router.push(`/producto/${p.id}`)">
          <img class="product__img" :src="p.image" :alt="p.alt" loading="lazy" />
          <div class="product__info">
            <div class="product__name">{{ p.name }}</div>
            <div class="product__meta">{{ p.category }}</div>
            <div class="product__price">{{ p.price }}</div>
          </div>
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <div class="footer__brandRow">
              <span class="brand__logo footer__logo" aria-hidden="true">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.28 12.72-4.24-4.24c-.39-.39-1.02-.39-1.41 0L5.39 14.72c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.9l5.28 5.24c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.42z"
                  />
                </svg>
              </span>
              <strong>Urbano</strong>
            </div>
            <p class="footer__muted">Viste con estilo, vive con confianza.</p>
          </div>

          <div>
            <div class="footer__title">Ayuda</div>
            <div class="footer__links">
              <a href="#">Contacto</a>
              <a href="#">Preguntas frecuentes</a>
              <a href="#">Política de Devoluciones</a>
              <a href="#">Sobre Nosotros</a>
            </div>
          </div>

          <div>
            <div class="footer__title">Categorías</div>
            <div class="footer__links">
              <router-link :to="{ path: '/buscar', query: { categoria: 'hombre' } }">Hombre</router-link>
              <router-link :to="{ path: '/buscar', query: { categoria: 'mujer' } }">Mujer</router-link>
              <router-link :to="{ path: '/buscar', query: { categoria: 'ninos' } }">Niños</router-link>
              <router-link :to="{ path: '/buscar', query: { categoria: 'ofertas' } }">Ofertas</router-link>
            </div>
          </div>

          <div>
            <div class="footer__title">Suscríbete</div>
            <p class="footer__muted">Recibe ofertas exclusivas y novedades.</p>
            <form class="footer__newsletter" @submit.prevent="newsletter = ''">
              <input v-model="newsletter" class="footer__input" type="email" placeholder="Tu email" />
              <button class="footer__btn" type="submit">Enviar</button>
            </form>
          </div>
        </div>

        <div class="footer__bottom">
          <span class="footer__muted">© 2024 Urbano. Todos los derechos reservados.</span>
          <div class="footer__social" aria-label="Redes sociales">
            <a href="#" aria-label="Facebook">Fb</a>
            <a href="#" aria-label="X">X</a>
            <a href="#" aria-label="Pinterest">P</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const q = ref("");
const newsletter = ref("");
const isMobileMenuOpen = ref(false);

function onSearch() {
  closeMenu();
  router.push({ path: "/buscar", query: q.value ? { q: q.value } : {} });
}

function closeMenu() {
  isMobileMenuOpen.value = false;
}

const heroStyle = computed(() => ({
  backgroundImage:
    'linear-gradient(rgba(0,0,0,.10), rgba(0,0,0,.40)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7qnHNGtjb_aI-JQr8RcC-UqMpZRtTM2JqYNpqrIybmASoEcyQMJWpnvXrof2bCaVN0W9dyxxXMGCajdmC4HJRoIPvlnAQgKDRMG6tCvnaGtTmtSsVQc3GtWBEC7rFjwnt5YnPOnfrNYNxJO0dcsXqUYtYuHYy8eOMYO8tnpNU-GS1fubwWx6-ZFY57gfxMQVEpc6qNv7QOB_437h58vzmElU0Zy1PLCZ-D5CEZz8kClP2g8e-9V8Bh8II1F5c9c7p6BNm7EUS-swF")',
}));

const featuredCollections = [
  {
    key: "novedades-mujer",
    title: "Novedades Mujer",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKOEvDCP_2B3KSpbGdRHjcoEhK_3h-uj6SXpMGb_NbAaKmAdC-SOs2RsfYS_Us-bZc2zymGAtIgn-JbNeLAHMnH_v2YftwWzCxXCaFfZtS-pIlpE9Zfp0S4-AY3MQkD_0SALeE8dFNexuia4tNU6Uap7i5Ev-L-EKHU2lNypygB3G5SaTOGMLPQdLi3z2SU087xX-VlPmnpAtjhcmEDaH6hgBJ84ali8OYhswXX8BdJSqxxnvnT__8X2Bl1VfqnMdH0Befi8imDR18",
  },
  {
    key: "mas-vendido-hombre",
    title: "Lo Más Vendido Hombre",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyq6k7G-kd8CemcmDfkb0ZxnU9neuJ9bqJehz-jKl0XjZsm73Cefj0sPkRf8Gt00s7B-iokADka2TTt_4KU3qZznu9HmCpixUCZK2TYSF1d8vAeD1N-c_rMJskKK0m0bAcheTcx7joeLFJVLlpiRrWBDAZ851vz3VRVF33uRvXxLkmN-Yn-70ERlyUZoexgJwPFnuC1924Flr3_zEOBcSQoQzmN3INZDxtjyKQGKHQ2s6owjamks0rtXEnu0UqtpQ8qNmVBTY_3Q_-",
  },
  {
    key: "ofertas-semana",
    title: "Ofertas de la Semana",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKYl3yc1HpVawTQeaW2ZWXxvMCFVIGSgRvCCd7xz1B5GEnuPtEG1CvFQ0awwz9QMQWTwUAMZEKtE_w3Ak5hQJ6VOuRUnRB-cJ1g4XeTCZB_Yrd7KQgQ5Bp3V_LrIwKQZcsrIrv6QUr-CuPmxD_X4osxvn1TLAvSHX0L9es63f77v8wpLkXeRsvfzAXFE2hWkw_o2qXiomxien3rpSZ7X3HEP6bY7SfRUwd439qkXY7N363HBoo5In49Q1DzS2KJh4hJMv-R0QR5XSp",
  },
];

const recommendedProducts = [
  {
    id: 1,
    name: "Chaqueta Denim Clásica",
    category: "Hombre",
    price: "59,99 €",
    alt: "Chaqueta de mezclilla azul",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
  },
  {
    id: 2,
    name: "Vestido Floral de Verano",
    category: "Mujer",
    price: "75,00 €",
    alt: "Vestido floral de verano",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZy2LFwRYIyaySPQnIW0U9675tEraSZGFX3TYyfBvDPK0qXVot4mgG90VuYMvH7K7giDXEUdGSojBLxYVSIyLciCBzZb_FxnzKlgFXPZIo-QxsBw-LIIXBMlyF2G0Qb7bRVqs3_f77KUwXEMmLm4oXqwi5nhbAVIckgfXl1EnukicdD90R9Bq5G_ePsLNUl-fH9XEya1mRRN1Q-zkEoh7sX4Z6l-gMSSd-eOc1T4CZNGfbGJWMI2gfZWM-EOMtA3xz2lIoFElHFk",
  },
  {
    id: 3,
    name: "Camiseta Gráfica",
    category: "Niños",
    price: "24,90 €",
    alt: "Camiseta gráfica para niños",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRFAGGhSMBmQ40LaqXslu12GmanoZJQYllCng45nC6Jrmt76hTYqgEhAHpDf8c6RPfzw5nWn9Gc1eWctMYFOtg1vhWcfWh_GRQHnaO4RgI-GGoF1iAZnRnRpOlJDyXvS0H-tEqU-xxh276vqYV-b1R7pLG2SWIcwujKRLb_Ii1eGJOw9u9c1ivpjVAYIozjnRNWc8NdeW9ykhgPvDsxi0_m7XcqxTSbX5RQM91sD9UizpR_jggaGKFe98NgHNpscc1amygSieRG2GF",
  },
  {
    id: 4,
    name: "Sudadera con Capucha",
    category: "Unisex",
    price: "49,95 €",
    alt: "Sudadera con capucha color neutro",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpeAWhVT7GZzKCy-91AvDCM2YK25pvEh7rQF4oeGfXODpUHHgc6JpkO03Mq_UguttJ9kdHVvwszGTlK1Lni2qh7g74jPxG75qSOf7JOSPRpc6PL0_oUcCotZ8F7Y8ZPejwWm-luSC63JanFDkcRUt0dVGsD1cps2WTy2QQO5nfLBT3y60tsus7YqazknfPoo4tmVsXCc_1idf-fGgYtBedxjL06uGood0vpRvPjPbxcoekLlJObttU3BPl3cfPyjprKrODfed0Rg2M",
  },
];

function collectionBg(img) {
  return {
    backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,0)), url("${img}")`,
  };
}
</script>

<style scoped>
.page {
  min-height: 100vh;
}

/* Brand */
.brand__logo {
  color: var(--primary);
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
}
.brand__name {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

/* Actions */
.actions {
  display: flex;
  gap: 6px;
  align-items: center;
}
.iconbtn--menu {
  display: inline-grid;
}
@media (min-width: 768px) {
  .iconbtn--menu {
    display: none;
  }
}

/* Mobile menu */
.mobilemenu {
  border-top: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(10px);
}
.mobilemenu__inner {
  padding: 10px 16px 14px;
  display: grid;
  gap: 8px;
}
.mobilemenu__item {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  font-weight: 700;
}
.mobilemenu__item:hover {
  background: rgba(148, 163, 184, 0.15);
}

/* Hero text */
.hero__title {
  font-size: clamp(30px, 4vw, 52px);
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 0;
}
.hero__subtitle {
  margin: 0;
  font-size: 15px;
  max-width: 720px;
  opacity: 0.95;
}

/* Collections */
.collection__title {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
}

/* Footer */
.footer {
  margin-top: 56px;
  padding: 40px 0 22px;
  background: rgba(148, 163, 184, 0.12);
  border-top: 1px solid var(--border);
}
.footer__grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .footer__grid {
    grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
    gap: 32px;
  }
}
.footer__brandRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.footer__logo {
  width: 20px;
  height: 20px;
}
.footer__title {
  font-weight: 900;
  margin-bottom: 10px;
}
.footer__links {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}
.footer__links a:hover {
  color: var(--primary);
}
.footer__muted {
  color: var(--muted);
  font-size: 14px;
}
.footer__newsletter {
  display: grid;
  grid-template-columns: 1fr auto;
  margin-top: 10px;
}
.footer__input {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 10px 0 0 10px;
  outline: none;
}
.footer__btn {
  border: 0;
  background: var(--primary);
  color: #fff;
  font-weight: 900;
  padding: 0 14px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
}
.footer__btn:hover {
  filter: brightness(0.95);
}
.footer__bottom {
  margin-top: 26px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: space-between;
}
@media (min-width: 640px) {
  .footer__bottom {
    flex-direction: row;
    align-items: center;
  }
}
.footer__social {
  display: flex;
  gap: 12px;
}
.footer__social a {
  color: var(--muted);
  font-weight: 900;
}
.footer__social a:hover {
  color: var(--primary);
}

/* Material symbols */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
