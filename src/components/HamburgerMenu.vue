<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

    function toggleMenu() {
      isMenuOpen.value = !isMenuOpen.value;

    }
</script>

<template>
<nav>
      <div>
        <button @click="toggleMenu">
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 cursor-pointer">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isMenuOpen">
    <RouterLink to="/login" class="ml-auto">
      <h2 class="font-[Overpass] text-[20px]">Profil</h2>
    </RouterLink>
    <RouterLink to="/savedtexts" class="ml-auto">
      <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
    </RouterLink>
    <!-- published router link -->
  </div>
</nav>
</template>
