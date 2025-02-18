<script setup>
import { ref } from 'vue';

const userText = ref("")

function onFormSubmit() {
    console.log("submitted", userText)
}

</script>

<template>
    <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <textarea v-model="userText" placeholder="Write whatever you want. Your goal is to write for 2 minutes, but don't limit yourself." name="userText" rows="10" cols="1"> </textarea>
      </div>
      <button type="submit" severity="secondary" label="Save text"></button>
  </form>

</template>
