<script setup>
import { RouterLink, RouterView } from "vue-router";
import PromptGenerator from "./components/PromptGenerator.vue";

</script>

<template>
   <nav>
    <ul>
      <li>
        <!-- <RouterLink to="/">Hem</RouterLink> -->
      </li>
    </ul>
  </nav>
<PromptGenerator />
<main>
    <!-- <RouterView /> -->
  </main>
</template>

<style>
@import "tailwindcss";
</style>