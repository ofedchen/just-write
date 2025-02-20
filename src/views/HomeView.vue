<script setup>
import PromptGenarator from "../components/PromptGenerator.vue";
import Textfield from "../components/Textfield.vue";
import Timer from "../components/Timer.vue";
</script>

<template>
    <main class="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 py-4">
      <PromptGenarator />
      <Textfield class="md:col-span-2" />
      <Timer />
    </main>
</template>
