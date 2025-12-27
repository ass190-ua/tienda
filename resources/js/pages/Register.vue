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
        <span class="breadcrumbs__current">Registro</span>
      </nav>

      <section class="authWrap">
        <!-- Card -->
        <div class="card">
          <div class="cardTop">
            <h1 class="title">Crear cuenta</h1>
            <p class="subtitle">Regístrate para comprar, guardar favoritos y ver tus pedidos.</p>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <div class="grid2">
              <div class="field">
                <label class="label" for="name">Nombre</label>
                <input
                  id="name"
                  v-model.trim="name"
                  class="input"
                  type="text"
                  autocomplete="name"
                  placeholder="Tu nombre"
                  :aria-invalid="!!errors.name"
                />
                <p v-if="errors.name" class="error">{{ errors.name }}</p>
              </div>

              <div class="field">
                <label class="label" for="email">Email</label>
                <input
                  id="email"
                  v-model.trim="email"
                  class="input"
                  type="email"
                  autocomplete="email"
                  placeholder="tuemail@ejemplo.com"
                  :aria-invalid="!!errors.email"
                />
                <p v-if="errors.email" class="error">{{ errors.email }}</p>
              </div>
            </div>

            <div class="field">
              <label class="label" for="password">Contraseña</label>
              <div class="passwordRow">
                <input
                  id="password"
                  v-model="password"
                  class="input"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="!!errors.password"
                />
                <button
                  class="iconbtn iconbtn--small"
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <span class="material-symbols-outlined">
                    {{ showPassword ? "visibility_off" : "visibility" }}
                  </span>
                </button>
              </div>
              <p v-if="errors.password" class="error">{{ errors.password }}</p>
              <p class="hint">Mínimo 6 caracteres. Recomendado: mayúsculas, números y símbolos.</p>
            </div>

            <div class="field">
              <label class="label" for="password2">Confirmar contraseña</label>
              <input
                id="password2"
                v-model="password2"
                class="input"
                type="password"
                autocomplete="new-password"
                placeholder="Repite tu contraseña"
                :aria-invalid="!!errors.password2"
              />
              <p v-if="errors.password2" class="error">{{ errors.password2 }}</p>
            </div>

            <div class="row">
              <label class="checkbox">
                <input type="checkbox" v-model="terms" />
                <span>
                  Acepto los <button class="linkBtn" type="button" @click="openTerms">términos</button> y la
                  <button class="linkBtn" type="button" @click="openPrivacy">política de privacidad</button>.
                </span>
              </label>
            </div>
            <p v-if="errors.terms" class="error" style="margin-top:-6px">{{ errors.terms }}</p>

            <button class="btn-primary w100" type="submit" :disabled="loading">
              <span class="material-symbols-outlined" aria-hidden="true">person_add</span>
              <span>{{ loading ? "Creando cuenta..." : "Crear cuenta" }}</span>
            </button>

            <p v-if="serverMessage" class="serverMsg">{{ serverMessage }}</p>

            <div class="divider"></div>

            <p class="bottomText">
              ¿Ya tienes cuenta?
              <router-link class="link" to="/login">Inicia sesión</router-link>
            </p>
          </form>
        </div>

        <!-- Side -->
        <aside class="side">
          <div class="sideCard">
            <h2 class="sideTitle">Qué consigues al registrarte</h2>
            <ul class="list">
              <li>Carrito persistente</li>
              <li>Wishlist y seguimiento</li>
              <li>Historial y estado de pedidos</li>
              <li>Checkout más rápido</li>
            </ul>

            <div class="callout">
              <span class="material-symbols-outlined">verified</span>
              <span>Tu cuenta te permite comprar y gestionar pedidos fácilmente.</span>
            </div>

            <div class="mini">
              <div class="mini__title">Consejo</div>
              <div class="mini__text">
                Usa un email real: ahí recibirás confirmaciones y el estado del envío.
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
const terms = ref(false);
const showPassword = ref(false);

const loading = ref(false);
const serverMessage = ref("");

const errors = reactive({
  name: "",
  email: "",
  password: "",
  password2: "",
  terms: "",
});

function validate() {
  errors.name = "";
  errors.email = "";
  errors.password = "";
  errors.password2 = "";
  errors.terms = "";

  if (!name.value) errors.name = "El nombre es obligatorio.";
  else if (name.value.length < 2) errors.name = "El nombre debe tener al menos 2 caracteres.";

  if (!email.value) errors.email = "El email es obligatorio.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.email = "Introduce un email válido.";

  if (!password.value) errors.password = "La contraseña es obligatoria.";
  else if (password.value.length < 6) errors.password = "Debe tener al menos 6 caracteres.";

  if (!password2.value) errors.password2 = "Confirma tu contraseña.";
  else if (password2.value !== password.value) errors.password2 = "Las contraseñas no coinciden.";

  if (!terms.value) errors.terms = "Debes aceptar los términos para continuar.";

  return !errors.name && !errors.email && !errors.password && !errors.password2 && !errors.terms;
}

async function onSubmit() {
  serverMessage.value = "";
  if (!validate()) return;

  loading.value = true;

  try {
    // Placeholder: luego aquí va el registro real en Laravel
    // Ejemplo futuro: await axios.post('/register', {...})
    await new Promise((r) => setTimeout(r, 500));

    localStorage.setItem(
      "urbano_auth_demo",
      JSON.stringify({ name: name.value, email: email.value, registeredAt: new Date().toISOString() })
    );

    serverMessage.value = "Cuenta creada ✅";
    router.push("/");
  } catch (e) {
    serverMessage.value = "No se pudo crear la cuenta. Inténtalo de nuevo.";
  } finally {
    loading.value = false;
  }
}

function openTerms() {
  alert("Más adelante esto abrirá la vista de Términos y Condiciones 🙂");
}
function openPrivacy() {
  alert("Más adelante esto abrirá la vista de Política de Privacidad 🙂");
}
</script>

<style scoped>
/* header bits */
.actions { display:flex; gap:8px; align-items:center; }
.brand { display:flex; align-items:center; gap:10px; }
.brand__logo { color: var(--primary); width: 26px; height: 26px; display:grid; place-items:center; }
.brand__name { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }
.iconbtn--small { width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border); background: rgba(148,163,184,.12); }

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

.authWrap {
  display: grid;
  gap: 18px;
  align-items: start;
}
@media (min-width: 1024px) {
  .authWrap { grid-template-columns: 1fr 0.9fr; gap: 22px; }
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
}
@media (min-width: 640px) {
  .card { padding: 22px; }
}

.cardTop { margin-bottom: 14px; }
.title {
  margin: 0;
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 950;
  letter-spacing: -0.03em;
}
.subtitle { margin: 10px 0 0; color: var(--muted); line-height: 1.6; }

.form { display: grid; gap: 14px; }
.grid2 { display: grid; gap: 14px; }
@media (min-width: 640px) {
  .grid2 { grid-template-columns: 1fr 1fr; }
}

.field { display: grid; gap: 8px; }
.label { font-weight: 900; }
.input {
  height: 46px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  padding: 0 12px;
  outline: none;
}
.input:focus { border-color: rgba(19,127,236,.55); box-shadow: 0 0 0 4px rgba(19,127,236,.12); }

.passwordRow {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

.error {
  margin: 0;
  color: #ef4444;
  font-weight: 800;
  font-size: 13px;
}

.row { display:flex; align-items:flex-start; gap: 10px; flex-wrap: wrap; }

.checkbox {
  display:flex;
  align-items:flex-start;
  gap: 10px;
  color: var(--muted);
  font-weight: 800;
  line-height: 1.5;
}
.checkbox input { margin-top: 3px; width: 16px; height: 16px; accent-color: var(--primary); }

.linkBtn {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--primary);
  font-weight: 900;
  padding: 0 2px;
}
.linkBtn:hover { text-decoration: underline; }

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
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.w100 { width: 100%; }

.serverMsg {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(19,127,236,.35);
  background: rgba(19,127,236,.10);
  color: var(--text);
  font-weight: 900;
}

.divider { height: 1px; background: var(--border); margin-top: 4px; }

.bottomText { margin: 0; color: var(--muted); font-weight: 800; }
.link { color: var(--primary); font-weight: 950; }
.link:hover { text-decoration: underline; }

/* side */
.sideCard {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
}
.sideTitle { margin: 0; font-size: 18px; font-weight: 950; }
.list { margin: 12px 0 0; padding-left: 18px; color: var(--muted); line-height: 1.8; font-weight: 800; }

.callout {
  margin-top: 14px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(19,127,236,.25);
  background: rgba(19,127,236,.08);
  display:flex;
  gap: 10px;
  align-items:center;
  color: var(--text);
  font-weight: 900;
}

.mini {
  margin-top: 14px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(148,163,184,.12);
}
.mini__title { font-weight: 950; }
.mini__text { margin-top: 6px; color: var(--muted); font-weight: 800; line-height: 1.5; }

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
