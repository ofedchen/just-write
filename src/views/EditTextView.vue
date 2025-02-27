<script setup>
  import { ref, onMounted } from "vue";
  import MySavedTexts from "./MySavedTexts.vue";

  function startEditingText() {}
</script>

<template>
  <div>
    <span v-if="!isEditing" v-on="startEditingText">....</span>
    <input v-else v-model="updatedText" />
  </div>
</template>
