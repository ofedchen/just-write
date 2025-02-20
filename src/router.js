import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import MySavedText from "./views/MySavedText.vue";

const router = createRouter( {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
        component: HomeView,
        path: "/",
      },
      {
        component: MySavedText,
        path: "/mysavedtext",
      },
    ],
  });

  export default router
