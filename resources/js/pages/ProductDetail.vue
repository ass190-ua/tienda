<template>
  <div class="page">
    <!-- HEADER (mismo patrón que Home/Search) -->
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
      <!-- Breadcrumb -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <router-link class="breadcrumbs__link" to="/">Inicio</router-link>
        <span class="breadcrumbs__sep">/</span>

        <router-link
          v-if="product?.genderKey"
          class="breadcrumbs__link"
          :to="{ path: '/buscar', query: { categoria: product.genderKey } }"
        >
          {{ product.genderLabel }}
        </router-link>
        <span v-if="product?.genderKey" class="breadcrumbs__sep">/</span>

        <router-link
          v-if="product?.categoryKey"
          class="breadcrumbs__link"
          :to="{ path: '/buscar', query: { categoria: product.genderKey, sub: product.categoryKey } }"
        >
          {{ product.categoryLabel }}
        </router-link>
        <span v-if="product?.categoryKey" class="breadcrumbs__sep">/</span>

        <span class="breadcrumbs__current">{{ product?.name ?? "Producto" }}</span>
      </nav>

      <div v-if="!product" class="notFoundCard">
        <h1 class="notFoundTitle">Producto no encontrado</h1>
        <p class="notFoundText">No existe un producto con ID: <strong>{{ productId }}</strong></p>
        <div class="notFoundActions">
          <button class="btn-primary" type="button" @click="$router.push('/buscar')">Volver a buscar</button>
          <button class="btn-ghost" type="button" @click="$router.back()">Atrás</button>
        </div>
      </div>

      <template v-else>
        <!-- TOP: gallery + info -->
        <section class="topGrid">
          <!-- Gallery -->
          <div class="gallery">
            <div class="thumbs" aria-label="Miniaturas">
              <button
                v-for="(img, idx) in product.images"
                :key="img"
                class="thumb"
                :class="{ 'thumb--active': idx === activeImage }"
                type="button"
                @click="activeImage = idx"
                :aria-label="`Ver imagen ${idx + 1}`"
              >
                <img :src="img" alt="" loading="lazy" />
              </button>
            </div>

            <div class="mainImage" aria-label="Imagen principal">
              <img
                class="mainImage__img"
                :src="product.images[activeImage]"
                :alt="product.name"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Info -->
          <div class="info">
            <div class="metaLine">
              <span class="muted">
                Marca: <strong>{{ product.brand }}</strong> · REF: <strong>{{ product.ref }}</strong>
              </span>
            </div>

            <h1 class="title">{{ product.name }}</h1>

            <div class="ratingRow">
              <div class="stars" aria-label="Valoración">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="material-symbols-outlined star"
                  :class="{ 'star--filled': n <= Math.round(product.rating) }"
                >
                  star
                </span>
              </div>
              <a class="reviewsLink" href="#reviews">({{ product.reviews.length }} valoraciones)</a>
            </div>

            <p class="desc">
              {{ product.shortDescription }}
            </p>

            <div class="price">{{ formatPrice(product.price) }}</div>

            <!-- Colors -->
            <div class="block">
              <div class="blockTitle">Color: <span class="blockValue">{{ selectedColor.label }}</span></div>
              <div class="colors">
                <button
                  v-for="c in product.colors"
                  :key="c.key"
                  type="button"
                  class="colorDot"
                  :class="{ 'colorDot--active': c.key === selectedColor.key }"
                  :style="{ background: c.hex }"
                  @click="selectedColor = c"
                  :aria-label="`Color ${c.label}`"
                />
              </div>
            </div>

            <!-- Sizes -->
            <div class="block">
              <div class="blockTitle">Talla</div>
              <div class="sizes">
                <button
                  v-for="s in product.sizes"
                  :key="s.key"
                  type="button"
                  class="sizeBtn"
                  :class="{
                    'sizeBtn--active': s.key === selectedSize.key,
                    'sizeBtn--disabled': !s.available
                  }"
                  :disabled="!s.available"
                  @click="selectedSize = s"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>

            <!-- Qty -->
            <div class="block">
              <div class="blockTitle">Cantidad</div>
              <div class="qty">
                <button class="qtyBtn" type="button" @click="decQty" :disabled="qty <= 1">−</button>
                <div class="qtyValue">{{ qty }}</div>
                <button class="qtyBtn" type="button" @click="incQty">+</button>
              </div>
            </div>

            <!-- CTA -->
            <div class="ctaRow">
              <button class="btn-primary ctaMain" type="button" @click="addToCart()">
                <span class="material-symbols-outlined">shopping_bag</span>
                <span>Añadir al carrito</span>
              </button>

              <button class="btn-ghost ctaIcon" type="button" @click="toggleWishlist()" :aria-label="wishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'">
                <span class="material-symbols-outlined">
                  {{ wishlisted ? "favorite" : "favorite" }}
                </span>
              </button>
            </div>

            <div class="shipping">
              <span class="material-symbols-outlined">local_shipping</span>
              <span>Envío gratis en 2-4 días. Devoluciones gratuitas.</span>
            </div>
          </div>
        </section>

        <!-- Details -->
        <section class="section">
          <h2 class="sectionTitle">Detalles del Producto</h2>
          <div class="details">
            <p>{{ product.longDescription }}</p>

            <ul class="specs">
              <li><strong>Material:</strong> {{ product.specs.material }}</li>
              <li><strong>Corte:</strong> {{ product.specs.fit }}</li>
              <li><strong>Detalles:</strong> {{ product.specs.details }}</li>
              <li><strong>Cuidados:</strong> {{ product.specs.care }}</li>
            </ul>
          </div>
        </section>

        <!-- Reviews -->
        <section id="reviews" class="section">
          <div class="reviewsHeader">
            <h2 class="sectionTitle" style="margin:0">Valoraciones de Clientes</h2>
            <button class="btn-ghost" type="button" @click="writeReview()">
              Escribir una valoración
            </button>
          </div>

          <div class="reviews">
            <article v-for="r in product.reviews" :key="r.id" class="review">
              <img class="review__avatar" :src="r.avatar" :alt="`Avatar de ${r.author}`" />
              <div class="review__body">
                <div class="review__top">
                  <div class="review__author">{{ r.author }}</div>
                  <div class="stars stars--sm" aria-label="Valoración">
                    <span
                      v-for="n in 5"
                      :key="n"
                      class="material-symbols-outlined star"
                      :class="{ 'star--filled': n <= r.stars }"
                    >
                      star
                    </span>
                  </div>
                </div>
                <div class="review__time muted">{{ r.timeAgo }}</div>
                <p class="review__text">{{ r.text }}</p>
              </div>
            </article>
          </div>
        </section>

        <!-- Related / quick nav -->
        <section class="section">
          <div class="bottomRow">
            <button class="btn-ghost" type="button" @click="$router.push('/buscar')">Seguir comprando</button>
            <button class="btn-primary" type="button" @click="$router.push('/carrito')">Ir al carrito</button>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const productId = computed(() => String(route.params.id ?? ""));

// Mock “catálogo” mínimo (luego se sustituye por API real)
const CATALOG = [
  {
    id: "1",
    genderKey: "hombre",
    genderLabel: "Hombre",
    categoryKey: "chaquetas",
    categoryLabel: "Chaquetas",
    brand: "Urbano",
    ref: "HZ-2026-01",
    name: "Chaqueta Denim Clásica",
    rating: 4.2,
    price: 59.99,
    shortDescription:
      "Chaqueta vaquera atemporal, cómoda y fácil de combinar. Ideal para entretiempo.",
    longDescription:
      "Una chaqueta denim versátil para tu día a día. Corte regular, tejido resistente y acabado suave. Perfecta para looks casual o urbanos.",
    specs: {
      material: "100% Algodón",
      fit: "Regular fit, largo a la cadera.",
      details: "Cierre con botones, bolsillos frontales con solapa.",
      care: "Lavar a máquina en frío. No usar lejía. Secado al aire.",
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
    ],
    colors: [
      { key: "denim", label: "Denim", hex: "#5b7aa6" },
      { key: "black", label: "Negro", hex: "#111827" },
    ],
    sizes: [
      { key: "XS", label: "XS", available: true },
      { key: "S", label: "S", available: true },
      { key: "M", label: "M", available: true },
      { key: "L", label: "L", available: true },
      { key: "XL", label: "XL", available: false },
    ],
    reviews: [
      {
        id: "r1",
        author: "Ana García",
        stars: 5,
        timeAgo: "Hace 2 semanas",
        text: "¡Me encanta! Sienta genial y el tejido es muy bueno.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4NIBUP_6rr40F3IMisE8tVHBX7K6fa_nfMwy517jfzqw8AFX2MJq9FZW0NVXLBi_pvjuEB41T33R5wlBI5cFw7e3X7bQ_UXy2fb3XH5ZM-sTe1prWhZFzGQxp_b8EBeXnmT4iGxfMWD-hwhwz9Lua5UwpGPKL1zMGl6NFE_7ZpIWikBIF0_n43tH_kwRMWjSgtiRIJUEixakaZu3PGzDBJCImo-XnhaL6oRf2SQ65TQiUtil9lU90iofap_JzCLvMOKJ3aizTgEd",
      },
    ],
  },

  // “Detalle” estilo vuestro mockup
  {
    id: "2",
    genderKey: "mujer",
    genderLabel: "Mujer",
    categoryKey: "vestidos",
    categoryLabel: "Vestidos",
    brand: "Elegancia Urbana",
    ref: "VZ-2024-45",
    name: "Vestido Midi de Lino con Cinturón",
    rating: 4.6,
    price: 89.99,
    shortDescription:
      "Una pieza esencial para tu armario de verano. Lino de alta calidad y cinturón a juego para una silueta favorecedora.",
    longDescription:
      "Este vestido encapsula la esencia de la elegancia relajada. Diseñado para ofrecer versatilidad, es perfecto tanto para un paseo por la ciudad como para una cena al atardecer. El tejido de lino puro no solo es transpirable y ligero, sino que también tiene una textura natural única que mejora con cada lavado.",
    specs: {
      material: "100% Lino Europeo",
      fit: "Silueta en A, longitud midi por debajo de la rodilla",
      details: "Escote en V, mangas cortas, cinturón de lazo extraíble",
      care: "Lavar a máquina en frío, ciclo delicado. No usar lejía. Secar en plano.",
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCmh5Gv7W9wGLPX0obscl2Rrx6IMk6xRPEk-Zgy5fR8iGfPffANJaMLNRKKzMpFnAd4EW7oz593gO_eEMmiktDr9dsMLbk3GY9MjFu-RQAt8DtuG2-wVIN0OHZl6d8ArzICQDpjIko5iB_Kb8kAToFm_y33b7S1RXp81gT8k9pa9bb-E53IdSQhdMyTiIpXKSoa0D3UvxgbfOBOeOs8e3g-QLbm13NHxagblTgVJK45Z0W-1Ajv0H6HNNSgqGGjLB8KmNeDCxBwCZ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfLTiAyAmTB0VQ4UnZVCg5iPt-HMMFUdXMz0265ZmnxwjLfFUmLJy1tAFXMmhsDKjRkzEghn1LfBeEAdplU6xf31RJMdm3h6M0jfk_A5rX9h3vWGOe308nfGfuNJM9kTfJ1w_dKhbW7tZBaVFkTumEND0au1zMGjYE6zjtqFxnTxalLQcDjUM78IoHU4nPArrq4q2mIk7FQ0wAhopOcslL7RlJDYdhUsEkRwxNeB7oYmhkg8S6nLE7UNMJVCp_-IHgf8Es95qkVlSa",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOBJWw5kjO8HjjmevBqx_7PNcmkeW383ndlm3I7qpAxeB8zgiquMF8YOt_SF2oB6LZy6fBG0cAYk2a0Bp35eisee2EK2LVrVkQRVj5oTjC6YizGc7nPRDk9FkTQ-RtMPIp2vydlHUolKmobHaD4guFXpWOlbjxVUgKp3H762brc8rgHh-j5kGj8n42Tc6XVFNkZ5L_yVMibE_jn66olDw5kSFiAqetmkidRMDwxbrBWACQbCg8JKSIX-AXdu9Pn59ZgtGF6Nu4itjQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVWi8SBGU4oJSf4XxXhC94n72Fx4jG1dgSOrUkS60RKTzcKl9jBavZf1XtuRAu-podPB6KI8473JZnPxm4lJC9ffml_qKWfWxkhjTlqOc_7WvDsxuTPxBIr7v2mmPFSn0hzwW4emHS7tD20b3n027JXrJg1oDg1f734Rf5ZqDzE59nsmwVXb1qCKzrQtjwOOtY--owclmGW_DBcS0cayxniKdJnWZ96jboF0-9Rd9mlsNzgf1jGjmi_lcbLwReW3ip8eWtZYz5Uz-h",
    ],
    colors: [
      { key: "beige", label: "Beige Natural", hex: "#f3e5d8" },
      { key: "forest", label: "Verde Bosque", hex: "#3b5d50" },
      { key: "sky", label: "Azul Cielo", hex: "#a3b1c6" },
    ],
    sizes: [
      { key: "XS", label: "XS", available: true },
      { key: "S", label: "S", available: true },
      { key: "M", label: "M", available: true },
      { key: "L", label: "L", available: true },
      { key: "XL", label: "XL", available: false },
    ],
    reviews: [
      {
        id: "r1",
        author: "Ana García",
        stars: 5,
        timeAgo: "Hace 2 semanas",
        text: "¡Absolutamente precioso! El tejido es muy fresco y de gran calidad. Sienta de maravilla.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4NIBUP_6rr40F3IMisE8tVHBX7K6fa_nfMwy517jfzqw8AFX2MJq9FZW0NVXLBi_pvjuEB41T33R5wlBI5cFw7e3X7bQ_UXy2fb3XH5ZM-sTe1prWhZFzGQxp_b8EBeXnmT4iGxfMWD-hwhwz9Lua5UwpGPKL1zMGl6NFE_7ZpIWikBIF0_n43tH_kwRMWjSgtiRIJUEixakaZu3PGzDBJCImo-XnhaL6oRf2SQ65TQiUtil9lU90iofap_JzCLvMOKJ3aizTgEd",
      },
      {
        id: "r2",
        author: "Carlos Martínez",
        stars: 4,
        timeAgo: "Hace 1 mes",
        text: "Buen producto. El lino se arruga un poco (normal), pero la talla coincide y el color es fiel.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCPM_BE0q_vkSpzK-rB9gmCuV3kp-ioF5kbnxzTdYdcEjF6YpsDtTSQf0TyPwkfuZtnSKYltNQF5_UPFsrz8K0HhBPymQBJbcT_3P45GJkfDvDwt3HJH9cpYuhfIs-sH14WDf3WpEqsQ1NYO82SzwiCR4FFlnEJcYnhTt_pAYykf7QeA4gUqA6gXYCJkgwUHxa07tAj2QnUD-nFuDtjOT5i0eURaJmNv35EpbF-ST7MW-rs3Uy_DhMrnNcehXkrqARXMGJTDLbsOxsA",
      },
    ],
  },
];

const product = computed(() => CATALOG.find((p) => p.id === productId.value));

const activeImage = ref(0);
const qty = ref(1);
const wishlisted = ref(false);

const selectedColor = ref({ key: "", label: "", hex: "" });
const selectedSize = ref({ key: "", label: "", available: true });

// inicializa selección al cambiar de producto
watch(
  product,
  (p) => {
    if (!p) return;
    activeImage.value = 0;
    qty.value = 1;
    wishlisted.value = false;
    selectedColor.value = p.colors[0];
    const firstAvailable = p.sizes.find((s) => s.available) ?? p.sizes[0];
    selectedSize.value = firstAvailable;
  },
  { immediate: true }
);

function formatPrice(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function incQty() {
  qty.value += 1;
}
function decQty() {
  qty.value = Math.max(1, qty.value - 1);
}

function addToCart() {
  // Placeholder (luego: store + API / sesión)
  // Aquí podéis: guardar en localStorage o integrar con backend
  console.log("ADD_TO_CART", {
    productId: productId.value,
    color: selectedColor.value.key,
    size: selectedSize.value.key,
    qty: qty.value,
  });

  router.push("/carrito");
}

function toggleWishlist() {
  wishlisted.value = !wishlisted.value;
  console.log("WISHLIST", wishlisted.value, productId.value);
}

function writeReview() {
  // Placeholder: más adelante hacemos la vista de comentar / login requerido
  alert("Más adelante conectaremos esto con la vista de comentarios y el backend 🙂");
}
</script>

<style scoped>
/* header */
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

.topGrid {
  display: grid;
  gap: 26px;
  align-items: start;
}
@media (min-width: 1024px) {
  .topGrid { grid-template-columns: 1.08fr 0.92fr; gap: 44px; }
}

/* gallery */
.gallery { display: grid; gap: 14px; }
@media (min-width: 768px) {
  .gallery { grid-template-columns: 92px 1fr; gap: 18px; }
}
.thumbs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
}
@media (min-width: 768px) {
  .thumbs { flex-direction: column; overflow: visible; padding-bottom: 0; }
}
.thumb {
  width: 86px;
  height: 118px;
  border-radius: 14px;
  border: 2px solid transparent;
  background: rgba(148,163,184,.12);
  overflow: hidden;
  cursor: pointer;
  flex: 0 0 auto;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; display:block; }
.thumb--active { border-color: var(--primary); }

.mainImage {
  border-radius: 18px;
  border: 1px solid var(--border);
  overflow: hidden;
  background: rgba(148,163,184,.12);
  aspect-ratio: 3 / 4;
}
.mainImage__img { width: 100%; height: 100%; object-fit: cover; display:block; }

/* info */
.metaLine { margin-top: 2px; }
.muted { color: var(--muted); font-size: 14px; }

.title {
  margin: 10px 0 0;
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 950;
  letter-spacing: -0.03em;
}
.ratingRow {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.stars { display: inline-flex; gap: 2px; color: #f59e0b; }
.stars--sm .star { font-size: 18px; }
.star { font-size: 22px; opacity: .45; }
.star--filled { opacity: 1; }
.reviewsLink { color: var(--muted); font-weight: 800; font-size: 14px; }
.reviewsLink:hover { color: var(--primary); }

.desc {
  margin: 14px 0 0;
  color: var(--muted);
  line-height: 1.6;
}
.price {
  margin-top: 14px;
  font-size: 34px;
  font-weight: 950;
  color: var(--text);
}

.block { margin-top: 18px; }
.blockTitle { font-weight: 950; margin-bottom: 10px; }
.blockValue { color: var(--primary); }

.colors { display: flex; gap: 10px; flex-wrap: wrap; }
.colorDot {
  width: 34px; height: 34px;
  border-radius: 999px;
  border: 1px solid var(--border);
  cursor: pointer;
}
.colorDot--active { outline: 3px solid rgba(19,127,236,.35); outline-offset: 2px; }

.sizes { display: flex; gap: 8px; flex-wrap: wrap; }
.sizeBtn {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 950;
  cursor: pointer;
}
.sizeBtn:hover { background: rgba(148,163,184,.12); }
.sizeBtn--active {
  border-color: rgba(19,127,236,.35);
  background: rgba(19,127,236,.12);
  color: var(--primary);
}
.sizeBtn--disabled {
  opacity: .45;
  cursor: not-allowed;
  text-decoration: line-through;
}

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

.ctaRow {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.ctaMain {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.ctaIcon {
  width: 52px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
}

.btn-ghost {
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 950;
  cursor: pointer;
}
.btn-ghost:hover { background: rgba(148,163,184,.12); }

.shipping {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--muted);
  font-weight: 800;
}

/* sections */
.section {
  margin-top: 34px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
}
.sectionTitle {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 950;
}
.details { color: var(--muted); line-height: 1.7; }
.specs { margin: 14px 0 0; padding-left: 18px; display: grid; gap: 8px; }
.specs strong { color: var(--text); }

/* reviews */
.reviewsHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.reviews { display: grid; gap: 18px; }
.review {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card);
}
.review__avatar { width: 52px; height: 52px; border-radius: 999px; object-fit: cover; }
.review__top { display:flex; justify-content: space-between; align-items: center; gap: 10px; }
.review__author { font-weight: 950; }
.review__time { margin-top: 6px; }
.review__text { margin: 10px 0 0; color: var(--muted); line-height: 1.6; }

/* bottom */
.bottomRow {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* not found */
.notFoundCard {
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed var(--border);
  background: var(--card);
}
.notFoundTitle { margin:0; font-size: 22px; font-weight: 950; }
.notFoundText { color: var(--muted); margin: 10px 0 0; }
.notFoundActions { margin-top: 14px; display:flex; gap: 10px; flex-wrap: wrap; }

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
