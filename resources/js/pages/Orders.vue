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
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <router-link class="breadcrumbs__link" to="/">Inicio</router-link>
        <span class="breadcrumbs__sep">/</span>
        <span class="breadcrumbs__current">Pedidos</span>
      </nav>

      <div class="topRow">
        <div>
          <h1 class="title">Mis pedidos</h1>
          <p class="subtitle">Consulta pedidos anteriores y el estado de los pedidos en curso.</p>
        </div>

        <div class="topActions">
          <button class="btn-ghost" type="button" @click="$router.push('/buscar')">
            Seguir comprando
          </button>
        </div>
      </div>

      <!-- Filters -->
      <section class="filters">
        <div class="searchBox">
          <span class="material-symbols-outlined searchIcon">search</span>
          <input
            v-model.trim="query"
            class="searchInput"
            type="text"
            placeholder="Buscar por nº de pedido, producto o referencia…"
          />
        </div>

        <div class="selectWrap">
          <label class="selectLabel" for="status">Estado</label>
          <select id="status" v-model="status" class="select">
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="servido">Servido</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <button class="btn-ghost" type="button" @click="resetFilters">
          Limpiar
        </button>
      </section>

      <!-- List -->
      <section v-if="filteredOrders.length" class="list">
        <article v-for="o in filteredOrders" :key="o.id" class="order">
          <div class="orderTop">
            <div class="orderLeft">
              <div class="orderId">
                Pedido <strong>#{{ o.number }}</strong>
              </div>
              <div class="orderMeta">
                <span>{{ formatDate(o.date) }}</span>
                <span class="dot">•</span>
                <span>{{ o.items.length }} {{ o.items.length === 1 ? "artículo" : "artículos" }}</span>
                <span class="dot">•</span>
                <span><strong>{{ formatPrice(o.total) }}</strong></span>
              </div>
            </div>

            <div class="orderRight">
              <span class="statusPill" :class="statusClass(o.status)">
                {{ statusLabel(o.status) }}
              </span>

              <button class="btn-ghost btnSmall" type="button" @click="toggleOpen(o.id)">
                <span class="material-symbols-outlined">
                  {{ open[o.id] ? "expand_less" : "expand_more" }}
                </span>
                <span>{{ open[o.id] ? "Ocultar" : "Ver" }}</span>
              </button>
            </div>
          </div>

          <transition name="fade">
            <div v-if="open[o.id]" class="orderBody">
              <div class="cols">
                <div class="col">
                  <div class="colTitle">Envío</div>
                  <div class="colText">
                    {{ o.shipping.name }}<br />
                    {{ o.shipping.address }}<br />
                    {{ o.shipping.city }} · {{ o.shipping.zip }}
                  </div>
                </div>

                <div class="col">
                  <div class="colTitle">Pago</div>
                  <div class="colText">
                    Método: {{ o.payment.method }}<br />
                    Estado: {{ o.payment.paid ? "Pagado" : "Pendiente" }}
                  </div>
                </div>

                <div class="col">
                  <div class="colTitle">Seguimiento</div>
                  <div class="colText">
                    <template v-if="o.tracking.code">
                      {{ o.tracking.carrier }} · <strong>{{ o.tracking.code }}</strong><br />
                      Última actualización: {{ o.tracking.lastUpdate }}
                    </template>
                    <template v-else>
                      Aún no disponible.
                    </template>
                  </div>
                </div>
              </div>

              <div class="itemsTitle">Productos</div>

              <div class="items">
                <div v-for="it in o.items" :key="it.key" class="item">
                  <button class="imgBtn" type="button" @click="goProduct(it.productId)">
                    <img class="img" :src="it.image" :alt="it.name" />
                  </button>

                  <div class="itemInfo">
                    <div class="itemNameRow">
                      <button class="itemName" type="button" @click="goProduct(it.productId)">
                        {{ it.name }}
                      </button>
                      <div class="itemPrice">{{ formatPrice(it.price) }}</div>
                    </div>

                    <div class="itemMeta">
                      <span>Marca: <strong>{{ it.brand }}</strong></span>
                      <span class="dot">•</span>
                      <span>REF: <strong>{{ it.ref }}</strong></span>
                    </div>

                    <div class="itemMeta">
                      <span>Color: <strong>{{ it.colorLabel }}</strong></span>
                      <span class="dot">•</span>
                      <span>Talla: <strong>{{ it.size }}</strong></span>
                      <span class="dot">•</span>
                      <span>Cantidad: <strong>{{ it.qty }}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="summary">
                <div class="sumRow">
                  <span>Subtotal</span>
                  <strong>{{ formatPrice(o.subtotal) }}</strong>
                </div>
                <div class="sumRow">
                  <span>Envío</span>
                  <strong>{{ o.shippingCost === 0 ? "Gratis" : formatPrice(o.shippingCost) }}</strong>
                </div>
                <div class="sumRow sumRow--total">
                  <span>Total</span>
                  <strong>{{ formatPrice(o.total) }}</strong>
                </div>
              </div>

              <div class="actionsRow">
                <button class="btn-ghost" type="button" @click="downloadInvoice(o)">
                  <span class="material-symbols-outlined">download</span>
                  <span>Factura</span>
                </button>

                <button class="btn-primary" type="button" @click="repeatOrder(o)">
                  <span class="material-symbols-outlined">shopping_bag</span>
                  <span>Repetir pedido</span>
                </button>
              </div>
            </div>
          </transition>
        </article>
      </section>

      <!-- Empty state -->
      <section v-else class="emptyCard">
        <div class="emptyIcon material-symbols-outlined" aria-hidden="true">receipt_long</div>
        <h2 class="emptyTitle">No hay pedidos que coincidan</h2>
        <p class="emptyText">Prueba a cambiar el filtro de estado o el texto de búsqueda.</p>
        <div class="emptyActions">
          <button class="btn-ghost" type="button" @click="resetFilters">Limpiar filtros</button>
          <button class="btn-primary" type="button" @click="$router.push('/buscar')">Ir a buscar</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const query = ref("");
const status = ref("");

const open = reactive({});

/** Mock orders (luego lo sustituimos por API real) */
const orders = ref([
  {
    id: "o1",
    number: "10482",
    date: "2025-12-01",
    status: "en_proceso",
    subtotal: 149.98,
    shippingCost: 0,
    total: 149.98,
    shipping: {
      name: "Isabel Pérez",
      address: "Calle Mayor 12, 3ºB",
      city: "Alicante",
      zip: "03001",
    },
    payment: { method: "TPVV", paid: false },
    tracking: { carrier: "Correos", code: "", lastUpdate: "" },
    items: [
      {
        key: "1",
        productId: "2",
        brand: "Elegancia Urbana",
        ref: "VZ-2024-45",
        name: "Vestido Midi de Lino con Cinturón",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCmh5Gv7W9wGLPX0obscl2Rrx6IMk6xRPEk-Zgy5fR8iGfPffANJaMLNRKKzMpFnAd4EW7oz593gO_eEMmiktDr9dsMLbk3GY9MjFu-RQAt8DtuG2-wVIN0OHZl6d8ArzICQDpjIko5iB_Kb8kAToFm_y33b7S1RXp81gT8k9pa9bb-E53IdSQhdMyTiIpXKSoa0D3UvxgbfOBOeOs8e3g-QLbm13NHxagblTgVJK45Z0W-1Ajv0H6HNNSgqGGjLB8KmNeDCxBwCZ",
        price: 89.99,
        colorLabel: "Beige Natural",
        size: "M",
        qty: 1,
      },
      {
        key: "2",
        productId: "1",
        brand: "Urbano",
        ref: "HZ-2026-01",
        name: "Chaqueta Denim Clásica",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
        price: 59.99,
        colorLabel: "Denim",
        size: "L",
        qty: 1,
      },
    ],
  },
  {
    id: "o2",
    number: "10410",
    date: "2025-11-10",
    status: "pagado",
    subtotal: 59.99,
    shippingCost: 4.99,
    total: 64.98,
    shipping: {
      name: "Isabel Pérez",
      address: "Calle Mayor 12, 3ºB",
      city: "Alicante",
      zip: "03001",
    },
    payment: { method: "TPVV", paid: true },
    tracking: { carrier: "Correos", code: "PQ91-22AS-77", lastUpdate: "Hace 3 días" },
    items: [
      {
        key: "1",
        productId: "1",
        brand: "Urbano",
        ref: "HZ-2026-01",
        name: "Chaqueta Denim Clásica",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA3B1w_7A99qkvBbvnx09DEBmw6tONi_zask0y4XNCJMjqeLTStdYgYHt13hEfXDlPxvmLEA3j5A91OueX6J_4O_GPJrLJ-Uea-1rXUPD8mZwi5Tl4VExuO6A41TeSCnSiAP0IgIWKvwy9PQyns2PCoDV4kwRr284O2b4Zljyw8m8fLBWUg8cDP069f2SVZQvwPW8N2TO_5tZFWGo-BI2DJ3INgoA6RrNrS0uAwsiSlAO77i-N00KR3do26FYODz7YdSEEorv4ojJ6Z",
        price: 59.99,
        colorLabel: "Negro",
        size: "M",
        qty: 1,
      },
    ],
  },
  {
    id: "o3",
    number: "10302",
    date: "2025-09-03",
    status: "cancelado",
    subtotal: 89.99,
    shippingCost: 0,
    total: 89.99,
    shipping: {
      name: "Isabel Pérez",
      address: "Calle Mayor 12, 3ºB",
      city: "Alicante",
      zip: "03001",
    },
    payment: { method: "TPVV", paid: false },
    tracking: { carrier: "", code: "", lastUpdate: "" },
    items: [
      {
        key: "1",
        productId: "2",
        brand: "Elegancia Urbana",
        ref: "VZ-2024-45",
        name: "Vestido Midi de Lino con Cinturón",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCmh5Gv7W9wGLPX0obscl2Rrx6IMk6xRPEk-Zgy5fR8iGfPffANJaMLNRKKzMpFnAd4EW7oz593gO_eEMmiktDr9dsMLbk3GY9MjFu-RQAt8DtuG2-wVIN0OHZl6d8ArzICQDpjIko5iB_Kb8kAToFm_y33b7S1RXp81gT8k9pa9bb-E53IdSQhdMyTiIpXKSoa0D3UvxgbfOBOeOs8e3g-QLbm13NHxagblTgVJK45Z0W-1Ajv0H6HNNSgqGGjLB8KmNeDCxBwCZ",
        price: 89.99,
        colorLabel: "Azul Cielo",
        size: "S",
        qty: 1,
      },
    ],
  },
]);

const filteredOrders = computed(() => {
  const q = query.value.toLowerCase().trim();
  const s = status.value;

  return orders.value.filter((o) => {
    const matchesStatus = !s || o.status === s;

    if (!q) return matchesStatus;

    const inNumber = o.number.includes(q);
    const inItems = o.items.some(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.brand.toLowerCase().includes(q) ||
        it.ref.toLowerCase().includes(q)
    );

    return matchesStatus && (inNumber || inItems);
  });
});

function toggleOpen(id) {
  open[id] = !open[id];
}

function resetFilters() {
  query.value = "";
  status.value = "";
}

function statusLabel(st) {
  switch (st) {
    case "pendiente":
      return "Pendiente";
    case "en_proceso":
      return "En proceso";
    case "servido":
      return "Servido";
    case "pagado":
      return "Pagado";
    case "cancelado":
      return "Cancelado";
    default:
      return st;
  }
}

function statusClass(st) {
  return {
    "status--pending": st === "pendiente",
    "status--progress": st === "en_proceso",
    "status--served": st === "servido",
    "status--paid": st === "pagado",
    "status--cancel": st === "cancelado",
  };
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}
function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "long", day: "2-digit" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

function goProduct(id) {
  router.push(`/producto/${id}`);
}

function downloadInvoice(order) {
  alert(`Factura de pedido #${order.number}: lo conectaremos con backend para descargar PDF 🙂`);
}

function repeatOrder(order) {
  alert(`Repetir pedido #${order.number}: lo conectaremos al carrito real 🙂`);
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

/* filters */
.filters {
  margin-top: 18px;
  display: grid;
  gap: 12px;
  align-items: end;
}
@media (min-width: 900px) {
  .filters { grid-template-columns: 1fr 220px auto; }
}

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

.selectWrap { display: grid; gap: 6px; }
.selectLabel { color: var(--muted); font-weight: 900; font-size: 13px; }
.select {
  height: 46px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  padding: 0 12px;
  font-weight: 900;
  outline: none;
}
.select:focus { border-color: rgba(19,127,236,.55); box-shadow: 0 0 0 4px rgba(19,127,236,.12); }

/* list */
.list { margin-top: 16px; display: grid; gap: 12px; }
.order {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
}
.orderTop {
  padding: 14px;
  display:flex;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.orderId { font-weight: 950; }
.orderMeta { margin-top: 6px; color: var(--muted); font-weight: 800; font-size: 13px; }
.dot { margin: 0 6px; }

.orderRight { display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }
.statusPill {
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 13px;
  border: 1px solid var(--border);
  background: rgba(148,163,184,.12);
}
.status--pending { color: #f59e0b; border-color: rgba(245,158,11,.35); background: rgba(245,158,11,.10); }
.status--progress { color: #3b82f6; border-color: rgba(59,130,246,.35); background: rgba(59,130,246,.10); }
.status--served { color: #8b5cf6; border-color: rgba(139,92,246,.35); background: rgba(139,92,246,.10); }
.status--paid { color: #22c55e; border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.10); }
.status--cancel { color: #ef4444; border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.10); }

.orderBody { padding: 14px; border-top: 1px solid var(--border); }

.cols {
  display: grid;
  gap: 12px;
}
@media (min-width: 900px) {
  .cols { grid-template-columns: repeat(3, 1fr); }
}
.colTitle { font-weight: 950; }
.colText { margin-top: 6px; color: var(--muted); font-weight: 800; line-height: 1.5; }

.itemsTitle { margin-top: 16px; font-weight: 950; }
.items { margin-top: 10px; display: grid; gap: 10px; }

.item {
  display: grid;
  grid-template-columns: 86px 1fr;
  gap: 12px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(148,163,184,.08);
}
.imgBtn { border: 0; background: transparent; padding: 0; cursor: pointer; border-radius: 12px; overflow: hidden; }
.img { width: 86px; height: 86px; object-fit: cover; display:block; }

.itemNameRow { display:flex; justify-content: space-between; gap: 10px; align-items: start; }
.itemName {
  border: 0; background: transparent; padding: 0;
  text-align: left; cursor: pointer;
  font-weight: 950; color: var(--text);
}
.itemName:hover { color: var(--primary); }
.itemPrice { font-weight: 950; white-space: nowrap; }

.itemMeta { margin-top: 6px; color: var(--muted); font-weight: 800; font-size: 13px; }

.summary {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: grid;
  gap: 8px;
}
.sumRow { display:flex; justify-content: space-between; color: var(--muted); font-weight: 900; }
.sumRow strong { color: var(--text); }
.sumRow--total { margin-top: 6px; font-size: 16px; }
.sumRow--total strong { font-size: 18px; }

.actionsRow {
  margin-top: 14px;
  display:flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.btn-ghost:hover { background: rgba(148,163,184,.12); }
.btnSmall { height: 40px; }

.btn-primary {
  height: 44px;
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

/* empty */
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

/* transition */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
