import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../pages/Home.vue");
const Search = () => import("../pages/Search.vue");
const Shop = () => import("../pages/Shop.vue")
const ProductDetail = () => import("../pages/ProductDetail.vue");
const Cart = () => import("../pages/Cart.vue");
const Login = () => import("../pages/Login.vue");
const Novedades = () => import("../pages/Novedades.vue")
const SobreNosotros = () => import("../pages/SobreNosotros.vue")
const Ayuda = () => import("../pages/Ayuda.vue")
const ForgotPassword = () => import("../pages/ForgotPassword.vue");

// opcionales (por si quieres ir dejándolos ya enlazados)
const Register = () => import("../pages/Register.vue");
const Wishlist = () => import("../pages/Wishlist.vue");
const Orders = () => import("../pages/Orders.vue");

const NotFound = () => import("../pages/NotFound.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: Home },

    // búsqueda / catálogo
    { path: "/search", name: "search", component: Search },

    { path: "/shop", name: "shop", component: Shop },

    // detalle de producto
    { path: "/producto/:id", name: "product", component: ProductDetail, props: true },

    // flujo compra
    { path: "/carrito", name: "cart", component: Cart },

    // auth
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
    { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword },

    // usuario
    { path: "/wishlist", name: "wishlist", component: Wishlist },
    { path: "/mis-pedidos", name: "orders", component: Orders },

    // footer
    { path: '/novedades', component: Novedades },
    { path: '/sobre-nosotros', component: SobreNosotros },
    { path: '/ayuda', component: Ayuda },

    // 404
    { path: "/:pathMatch(.*)*", name: "notfound", component: NotFound },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
