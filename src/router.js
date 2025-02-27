import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import MySavedTexts from "./views/MySavedTexts.vue";
import LoginView from "./views/LoginView.vue";
import ProfileView from "./views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: HomeView,
      path: "/"
    },
    {
      component: MySavedTexts,
      path: "/savedtexts"
    },
    { component: LoginView, path: "/login" },
    { component: ProfileView, path: "/profile" }
  ]
});

export default router;
