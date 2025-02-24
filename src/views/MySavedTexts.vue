<script setup>
import { ref, onMounted } from 'vue'

const savedTexts = ref([])

// const hidden = ref(false)

onMounted(() => {
  // function to sync saved texts with the local storage
  if (localStorage.getItem("savedTexts") && localStorage.getItem("savedTexts") !== null) {
    savedTexts.value = JSON.parse(localStorage.getItem("savedTexts"))
    console.log(savedTexts.value)
  }
});

  function readMore() {
    // function to expand and minimize saved texts EJ KLAR

  }


</script>

<template>

    <div class="container mx-auto px-4 py-4" v-for="text in savedTexts">
        <h2 class="font-[Overpass] text-[18px] font-semibold">Writing prompt: <span>{{ text.prompt }} </span></h2>
        <h3>Date: {{ text.date }} </h3>
        <p class="w-full max-w-180">{{ text.text.slice(0, 80) }}</p>

        <!-- read more button -->
        <button @click="readMore" class="underline font-medium
        text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Read more</button>
        <!-- close read more -->
        <div>
          <button class="underline font-medium
          text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Close</button>
        </div>

        <!-- edit button -->
        <button class="relative focus:outline-none text-[#FFFFFF]
        bg-gray-800 hover:bg-gray-900 focus:ring-2 font-medium rounded-lg
        text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Edit</button>
        <!-- ADD Functionality to edit and show short version and expand -->

    </div>
</template>
