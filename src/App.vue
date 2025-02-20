<script setup>
import { RouterLink, RouterView } from "vue-router";
import HamburgerMenu from "./components/HamburgerMenu.vue"
</script>

<template>
  <RouterLink to='/'>
    <h1 class="font-[Special_Elite] text-[42px] text-center py-8">Just Write</h1>
  </RouterLink>
  <RouterLink to='/savedtexts'>
    <h2 class="font-[Overpass] text-[18px] text-right py-4 px-8">My saved writings</h2>
  </RouterLink>
  <nav>
    <!-- <HamburgerMenu /> -->
  </nav>
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&family=Special+Elite&display=swap');
@import "tailwindcss";
</style>
