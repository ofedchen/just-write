<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <RouterLink to='/'>
      <h1 class="font-[Special_Elite] text-[42px] text-center py-8">Just Write</h1>
      <RouterLink to='/mysavedtext'><h2 class="font-[Special_Elite] text-[18px] text-right py-4 px-8">My saved writings</h2></RouterLink>
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
