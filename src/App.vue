<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import HamburgerMenu from "./components/HamburgerMenu.vue";
  import { useInlogStatus } from "./store/";
  import { useRouter, useRoute } from "vue-router";

  import { UserIcon } from "@heroicons/vue/24/solid";

  const inlog = useInlogStatus();
  const router = useRouter();
  const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
  };

  const redirectToProfile = () => {
    router.push("/profile");
  };
</script>

<template>
  <header class="py-7">
    <RouterLink to="/">
      <h1 class="font-[Special_Elite] text-[42px] text-center">Just Write</h1>
    </RouterLink>
    <nav class="flex justify-between items-center py-2 md:pb-20 px-8 -mt-6.5">
      <RouterLink to="/" v-show="!isActiveLink('/')">
        <img
          src="../assets/arrow.png"
          alt="Go to homepage"
          class="w-[50px]"
        />
      </RouterLink>

      <HamburgerMenu class="ml-auto" :is-active-link="isActiveLink" />
      <div
        v-if="inlog.user"
        class="flex place-content-end p-3 text-xl cursor-pointer hidden md:flex"
        @click="redirectToProfile"
      >
        <h2 class="mr-3">Hello {{ inlog.user }}</h2>

        <UserIcon class="h-8 w-8" />
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&family=Special+Elite&display=swap");
  @import "tailwindcss";
  @import "primeicons/primeicons.css";
</style>
