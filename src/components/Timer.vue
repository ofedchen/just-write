<!-- SOOURCES:

https://geekiebarbs.hashnode.dev/build-a-countdown-app-with-vuejs-using-composition-api
https://www.w3schools.com/howto/howto_js_countdown.asp
https://www.w3schools.com/jsref/met_win_setinterval.asp
https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval

 -->

<script setup>
import { ref, computed, onBeforeUnmount, watch } from "vue";
const startTime = 120200;
const now = ref(0);
const countDownTime = ref(startTime);
const timeRemaining = ref(startTime);
const timerStarted = ref(false);
const timerEnded = ref(false);

const min = computed(() =>
  Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60))
);
const sec = computed(() =>
  Math.floor((timeRemaining.value % (1000 * 60)) / 1000)
);

let interval;

const startTimer = () => {
  now.value = new Date().getTime();
  timeRemaining.value = startTime;

  countDownTime.value = now.value + startTime;

  interval = setInterval(() => {
    now.value = new Date().getTime();
    timeRemaining.value = Math.max(0, countDownTime.value - now.value);
  }, 1000);
};

// not necessary, best practice. makes sure countdown stops and does not run i background.
onBeforeUnmount(() => {
  clearInterval(interval);
});

// Här hämtar vi props från App.vue
const props = defineProps({
  userStarted: { type: String },
});

watch(
  () => props.userStarted,
  (newValue) => {
    if (newValue && !timerStarted.value) {
      startTimer();
    }
    timerStarted.value = true;
  }
);
watch(
  () => timeRemaining.value,
  (newTimeRemaining) => {
    if (newTimeRemaining === 0) {
      timerEnded.value = true;
    }
  }
);
</script>

<template>
  <div
    class="font-[Special_Elite] bg-gray-800 text-white text-center rounded-lg text-lg font-semibold p-1.5 w-auto shadow-lg shadow-gray-900/50"
    :class="{ 'bg-red-800': timerEnded }"
  >
    <p v-if="!timerEnded">
      {{ min }}<span class="text-sm text-gray-400">m</span> {{ ": " + sec
      }}<span class="text-sm text-gray-400">s</span>
    </p>
    <p v-if="timerEnded">Time's up!</p>
  </div>
</template>
