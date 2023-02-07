import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import Transferir from "../views/Transferir.vue";
import CargarSaldo from "../views/CargarSaldo.vue";
import ActualizarDatos from "../views/ActualizarDatos.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/transferencia",
      name: "transferencia",
      component: Transferir,
    },
    {
      path: "/cargarSaldo",
      name: "cargarSaldo",
      component: CargarSaldo,
    },
    {
      path: "/actualizarDatos",
      name: "actualizarDatos",
      component: ActualizarDatos,
    }
  ],
});

export default router;
