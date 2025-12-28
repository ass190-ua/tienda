<template>
  <v-footer class="footer-shell" color="transparent">
    <v-container fluid class="px-8 py-10">
      <!-- Parte superior: 4 columnas -->
      <v-row class="gy-8" align="start">
        <!-- Col 1: Marca -->
        <v-col cols="12" sm="6" md="3">
          <div class="brand-row">
            <v-icon icon="mdi-feather" size="22" />
            <span class="brand">TiendaModa</span>
          </div>
          <p class="tagline text-medium-emphasis mt-3">
            Viste con estilo, vive con confianza.
          </p>
        </v-col>

        <!-- Col 2: Ayuda -->
        <v-col cols="12" sm="6" md="3">
          <div class="col-title">Ayuda</div>
          <div class="links">
            <RouterLink class="link" to="/contacto">Contacto</RouterLink>
            <RouterLink class="link" to="/faq">Preguntas frecuentes</RouterLink>
            <RouterLink class="link" to="/devoluciones">Política de Devoluciones</RouterLink>
            <RouterLink class="link" to="/sobre-nosotros">Sobre Nosotros</RouterLink>
          </div>
        </v-col>

        <!-- Col 3: Categorías -->
        <v-col cols="12" sm="6" md="3">
          <div class="col-title">Categorías</div>
          <div class="links">
            <RouterLink class="link" to="/categoria/hombre">Hombre</RouterLink>
            <RouterLink class="link" to="/categoria/mujer">Mujer</RouterLink>
            <RouterLink class="link" to="/categoria/ninos">Niños</RouterLink>
            <RouterLink class="link" to="/ofertas">Ofertas</RouterLink>
          </div>
        </v-col>

        <!-- Col 4: Suscripción -->
        <v-col cols="12" sm="6" md="3">
          <div class="col-title">Suscríbete</div>
          <p class="text-medium-emphasis mt-3 mb-4">
            Recibe ofertas exclusivas y novedades.
          </p>

          <div class="subscribe">
            <v-text-field
              v-model="email"
              hide-details
              density="compact"
              variant="outlined"
              placeholder="Tu email"
              class="email"
            />
            <v-btn color="primary" class="send-btn" @click="onSubscribe">
              Enviar
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Línea separadora -->
      <v-divider class="my-8" />

      <!-- Barra inferior -->
      <div class="bottom">
        <div class="text-medium-emphasis">
          © {{ year }} TiendaModa. Todos los derechos reservados.
        </div>

        <div class="social">
          <v-btn icon variant="text" aria-label="Instagram">
          <v-icon icon="mdi-instagram" />
        </v-btn>
        <v-btn icon variant="text" aria-label="Twitter / X">
          <v-icon icon="mdi-twitter" />
        </v-btn>
        <v-btn icon variant="text" aria-label="Facebook">
          <v-icon icon="mdi-facebook" />
        </v-btn>
        <v-btn icon variant="text" aria-label="LinkedIn">
          <v-icon icon="mdi-linkedin" />
        </v-btn>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
import { ref } from 'vue'

const year = new Date().getFullYear()
const email = ref('')

function onSubscribe() {
  // De momento no lo conectamos a backend.
  // Más adelante se puede enviar a una API o mostrar un snackbar.
  email.value = ''
}
</script>

<style scoped>
.footer-shell {
  background: rgb(var(--v-theme-background));
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand {
  font-weight: 800;
  font-size: 18px;
}

.tagline {
  max-width: 280px;
  line-height: 1.5;
}

.col-title {
  font-weight: 800;
  letter-spacing: 0.2px;
}

.links {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.65);
}

.link:hover {
  color: rgba(0, 0, 0, 0.9);
  text-decoration: underline;
}

.subscribe {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.email {
    flex: 1 1 240px;
    min-width: 220px;
}

.email :deep(.v-field__input) {
  min-height: 40px;
}

.send-btn {
  height: 40px;
  text-transform: none;
  font-weight: 700;
  border-radius: 10px;
  flex: 0 0 auto;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.social {
  display: flex;
  gap: 4px;
}

/* En móvil, apilamos la barra inferior */
@media (max-width: 600px) {
  .bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
