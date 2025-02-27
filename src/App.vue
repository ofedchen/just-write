<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import HamburgerMenu from "./components/HamburgerMenu.vue";

  import { useRoute } from "vue-router";

  const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
  };
</script>

<template>
  <header class="py-8">
    <RouterLink to="/">
      <h1 class="font-[Special_Elite] text-[42px] text-center">Just Write</h1>
    </RouterLink>
    <nav
      class="flex justify-between items-center py-2 md:pb-12 px-8 h-auto -mt-5"
    >
      <RouterLink to="/" v-show="!isActiveLink('/')">
        <img
          src="../../assets/arrow.png"
          alt="Go to homepage"
          class="w-[50px] m-4"
        />
      </RouterLink>
      <!-- <RouterLink to="/savedtexts" class="ml-auto">
        <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
      </RouterLink> -->
      <HamburgerMenu class="ml-auto" />
      <!-- <RouterLink to="/login" class="ml-auto">
        <h2 class="font-[Overpass] text-[20px]">Profil</h2>
      </RouterLink> -->
    </nav>
  </header>
  <RouterView />
</template>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&family=Special+Elite&display=swap");
  @import "tailwindcss";
  @import "primeicons/primeicons.css";
</style>
