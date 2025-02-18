<script setup>
import { RouterLink, RouterView } from "vue-router";
import PromptGenerator from "./components/PromptGenerator.vue";
</script>

<template>
  <RouterLink to='/' class="font-[Special_Elite] text-e">Just Write</RouterLink>
  <nav>
    <ul>
      <li>
        <!-- <RouterLink to="/">Hem</RouterLink> -->
      </li>
    </ul>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");
@import "tailwindcss";

</style>
