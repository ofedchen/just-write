<script setup>
import { defineProps } from "vue";
// import { ref } from "vue";

/* 
sets timer to current time + 2 minutes 
and converts milliseconds to minutes and seconds


*/

const now = new Date().getTime();
console.log("now " + now);

const countDownTime = now + 120000;
console.log("countDownTime " + countDownTime);

const distance = countDownTime - now;
console.log("distance " + distance);

const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
console.log("min " + min)

const sec =Math.floor((distance % (1000 * 60)) / 1000);
console.log("sec " + sec);


</script>

<template>
  <button @click="toggleEvents" type="button">Timer</button>
  <div>
    {{ min }} : {{ sec }}
  </div>
</template>

<!--

1. Lägg in en timer
2. Koppla timern till textfield
3. När användaren skriver


-->
