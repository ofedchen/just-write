<script setup>
import { ref, onMounted } from 'vue'

const savedTexts = ref([])

const hidden = ref(false)

onMounted(() => {
  // function to sync saved texts with the local storage
  if (localStorage.getItem("savedTexts") && localStorage.getItem("savedTexts") !== null) {
    savedTexts.value = JSON.parse(localStorage.getItem("savedTexts"))
    console.log(savedTexts.value)
  }
});

function readMore() {
  hidden.value = true
}


</script>

<template>

    <div class="container mx-auto px-4 py-4" v-for="text in savedTexts">
        <h2 class="font-[Overpass] text-[18px] font-semibold">Writing prompt: <span>{{ text.prompt }} </span></h2>
        <h3>Date: {{ text.date }} </h3>
        <p v-show="!hidden" class="w-full max-w-180">{{ text.text }}</p>
        <button @click="readMore" class="relative focus:outline-none text-[#FFFFFF]
        bg-gray-800 hover:bg-gray-900 focus:ring-2 font-medium rounded-lg
        text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Read more</button>
        <button class="relative focus:outline-none text-[#FFFFFF]
        bg-gray-800 hover:bg-gray-900 focus:ring-2 font-medium rounded-lg
        text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Edit</button>
        <!-- ADD Functionality to edit and show short version and expand -->
        <!-- <button>Read more</button> -->
        <!-- <button>Edit</button> -->
    </div>
</template>
