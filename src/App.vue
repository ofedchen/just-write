<script setup>
import { RouterLink, RouterView } from "vue-router";
import HamburgerMenu from "./components/HamburgerMenu.vue"
</script>

<template>
    <RouterLink to='/'>
      <h1 class="font-[Special_Elite] text-[42px] text-center py-8">Just Write</h1>
      <RouterLink to='/savedtexts'><h2 class="font-[Special_Elite] text-[18px] text-right py-4 px-8">My saved writings</h2></RouterLink>
    </RouterLink>
    <nav>
      <!-- <HamburgerMenu /> -->
    </nav>
    <RouterView />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");
@import "tailwindcss";
</style>
