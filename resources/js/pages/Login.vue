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
        <span class="breadcrumbs__current">Login</span>
      </nav>

      <section class="authWrap">
        <div class="card">
          <div class="cardTop">
            <h1 class="title">Iniciar sesión</h1>
            <p class="subtitle">Accede para comprar, guardar favoritos y ver tus pedidos.</p>
          </div>

          <form class="form" @submit.prevent="onSubmit">
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

            <div class="field">
              <label class="label" for="password">Contraseña</label>
              <div class="passwordRow">
                <input
                  id="password"
                  v-model="password"
                  class="input"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  :aria-invalid="!!errors.password"
                />
                <button class="iconbtn iconbtn--small" type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <span class="material-symbols-outlined">
                    {{ showPassword ? "visibility_off" : "visibility" }}
                  </span>
                </button>
              </div>
              <p v-if="errors.password" class="error">{{ errors.password }}</p>
            </div>

            <div class="row">
              <label class="checkbox">
                <input type="checkbox" v-model="remember" />
                <span>Recordarme</span>
              </label>

              <button class="linkBtn" type="button" @click="forgotPassword">
                ¿Has olvidado la contraseña?
              </button>
            </div>

            <button class="btn-primary w100" type="submit" :disabled="loading">
              <span class="material-symbols-outlined" aria-hidden="true">login</span>
              <span>{{ loading ? "Entrando..." : "Entrar" }}</span>
            </button>

            <p v-if="serverMessage" class="serverMsg">{{ serverMessage }}</p>

            <div class="divider"></div>

            <p class="bottomText">
              ¿No tienes cuenta?
              <router-link class="link" to="/register">Crear cuenta</router-link>
            </p>
          </form>
        </div>

        <!-- lado derecho decorativo / info -->
        <aside class="side">
          <div class="sideCard">
            <h2 class="sideTitle">Ventajas de tu cuenta</h2>
            <ul class="list">
              <li>Carrito persistente entre sesiones</li>
              <li>Lista de deseos y seguimiento</li>
              <li>Historial y estado de pedidos</li>
              <li>Checkout más rápido</li>
            </ul>

            <div class="callout">
              <span class="material-symbols-outlined">lock</span>
              <span>Pago seguro y gestión de pedidos desde tu perfil.</span>
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

const email = ref("");
const password = ref("");
const remember = ref(true);
const showPassword = ref(false);

const loading = ref(false);
const serverMessage = ref("");

const errors = reactive({
  email: "",
  password: "",
});

function validate() {
  errors.email = "";
  errors.password = "";

  if (!email.value) errors.email = "El email es obligatorio.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.email = "Introduce un email válido.";

  if (!password.value) errors.password = "La contraseña es obligatoria.";
  else if (password.value.length < 6) errors.password = "Debe tener al menos 6 caracteres.";

  return !errors.email && !errors.password;
}

async function onSubmit() {
  serverMessage.value = "";
  if (!validate()) return;

  loading.value = true;

  try {
    // Placeholder: aquí iría la llamada real al backend (Laravel)
    // Ejemplo futuro: await axios.post('/login', {...})
    await new Promise((r) => setTimeout(r, 450));

    // Simulación simple de "login ok"
    localStorage.setItem("urbano_auth_demo", JSON.stringify({ email: email.value, remember: remember.value }));

    serverMessage.value = "Login correcto ✅";
    // redirige a Home o a Perfil (cuando exista)
    router.push("/");
  } catch (e) {
    serverMessage.value = "No se pudo iniciar sesión. Inténtalo de nuevo.";
  } finally {
    loading.value = false;
  }
}

function forgotPassword() {
  alert("Más adelante conectaremos esto con la recuperación de contraseña 🙂");
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

.error {
  margin: 0;
  color: #ef4444;
  font-weight: 800;
  font-size: 13px;
}

.row {
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.checkbox {
  display:flex;
  align-items:center;
  gap: 10px;
  color: var(--muted);
  font-weight: 800;
}
.checkbox input { width: 16px; height: 16px; accent-color: var(--primary); }

.linkBtn {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--primary);
  font-weight: 900;
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

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
