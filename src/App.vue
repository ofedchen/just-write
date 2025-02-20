<script setup>
import { RouterLink, RouterView } from "vue-router";
import PromptGenerator from "./components/PromptGenerator.vue";
</script>

<template>
    <RouterLink to='/'>
      <h1 class="font-[Special_Elite] text-[42px] text-center py-8">Just Write</h1>
    </RouterLink>
    <nav>
      <ul>
        <li>
          <!-- <RouterLink to="/">Hem</RouterLink> -->
        </li>
      </ul>
    </nav>
    <RouterView />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");
@import "tailwindcss";
</style>
