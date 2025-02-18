<script setup>
import PromptGenarator from "../components/PromptGenerator.vue";
import Textfield from "../components/Textfield.vue";
</script>

<template>
  <main>
    <main class="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
      <PromptGenarator />
      <Textfield class="md:col-span-2" />
    </main>
  </main>
</template>
