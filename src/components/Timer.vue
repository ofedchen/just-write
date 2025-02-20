<script setup>
import { defineProps } from "vue";
// import { ref } from "vue";

const props = defineProps({ userText: { type: String } });

console.log(props.userText);

const countDownTime = new Date();

console.log(new Date().getMinutes());

const now = new Date().getTime();

const distance = countDownTime - now;
</script>

<template>
  <button @click="toggleEvents" type="button">Timer</button>
</template>

<!--

1. Lägg in en timer
2. Koppla timern till textfield
3. När användaren skriver


-->
