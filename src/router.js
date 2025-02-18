import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        component: HomeView,
        path: "/",
      },
    ],
  });
  