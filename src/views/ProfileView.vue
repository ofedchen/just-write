<script setup>
  import { RouterLink, RouterView } from 'vue-router'

  import { useRoute } from 'vue-router'
</script>

<template>
  <h1>Welcome {{}}</h1>

  <RouterLink to="/savedtexts" class="ml-auto">
    <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
  </RouterLink>
</template>
