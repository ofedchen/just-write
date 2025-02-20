<script setup>
import { ref, onMounted } from 'vue'

const savedTexts = ref([])

onMounted(() => {
  // function to sync saved texts with the local storage
  if (localStorage.getItem("savedTexts") && localStorage.getItem("savedTexts") !== null) {
    savedTexts.value = JSON.parse(localStorage.getItem("savedTexts"))
    console.log(savedTexts.value)
  }
});

</script>

<template>
    <div class="container mx-auto px-4 py-4" v-for="text in savedTexts">
        <h2 class="font-[Overpass] text-[18px] font-semibold">Writing prompt: <span>{{ text.prompt }} </span></h2>
        <h3>Date: {{ text.date }} </h3>
        <p>{{ text.text }}</p>
        <!-- ADD Functionality to edit and show short version and expand -->
        <!-- <button>Read more</button> -->
        <!-- <button>Edit</button> -->
    </div>
</template>
