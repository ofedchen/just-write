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
          <textarea v-model="userText" placeholder="Write whatever you want. Your goal is to write for 2 minutes, but don't limit yourself." name="userText" rows="10" cols="1"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"> </textarea>
      </div>
      <button type="submit" severity="secondary" label="Save text" class="px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Save text</button>
  </form>

</template>
