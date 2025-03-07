<!-- SOOURCES:

https://geekiebarbs.hashnode.dev/build-a-countdown-app-with-vuejs-using-composition-api
https://www.w3schools.com/howto/howto_js_countdown.asp
https://www.w3schools.com/jsref/met_win_setinterval.asp
https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval

 -->

<script setup>
  import { ref, computed, onBeforeUnmount, watch } from "vue";
  import { useInlogStatus } from "../store/";

  const emit = defineEmits(["timerStopped"]);

  const startTime = 10000; /* 120200; */
  const now = ref(0);
  const countDownTime = ref(startTime);
  const timeRemaining = ref(startTime);
  const timerStarted = ref(false);
  const timerEnded = ref(false);
  const showTotalElapsedTime = ref(false);
  const inlog = useInlogStatus();

  const countDownMin = computed(() =>
    Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60))
  );
  const countDownSec = computed(() =>
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

  const totalElapsedTime = computed(() => {
    return now.value - (countDownTime.value - startTime);
  });

  const totalElapsedMin = computed(() =>
    Math.floor((totalElapsedTime.value % (1000 * 60 * 60)) / (1000 * 60))
  );
  const totalElapsedSec = computed(() =>
    Math.floor((totalElapsedTime.value % (1000 * 60)) / 1000)
  );

  // not necessary, best practice. prevent countdown running in background
  onBeforeUnmount(() => {
    // clearInterval(interval);
  });

  const props = defineProps({
    userStarted: { type: String, default: "" },
    stopTimer: { type: Boolean, default: false }
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

        let audio = new Audio("public/sounds/buzz.wav");
        audio.play();
      }
    }
  );

  watch(
    () => props.stopTimer,
    (newValue) => {
      if (newValue) {
        showTotalElapsedTime.value = true;
        console.log("timer stopped");
        clearInterval(interval);
        timerEnded.value = true;

        emit("timerStopped", {
          minutes: totalElapsedMin.value,
          seconds: totalElapsedSec.value
        });
      }
    }
  );

  const sessionMinutes =
    JSON.parse(sessionStorage.getItem("savedMinutes")) || [];
  const sessionSeconds =
    JSON.parse(sessionStorage.getItem("savedSeconds")) || [];
</script>

<template>
  <div
    class="font-[Special_Elite] bg-gray-800 text-white text-center rounded-lg text-lg font-semibold p-2 w-auto shadow-lg shadow-gray-900/50"
    :class="{ 'transition duration-3000 bg-gray-800 opacity-10': timerEnded }"
  >
    <p v-if="!timerEnded">
      {{ countDownMin }}<span class="text-sm text-gray-400">m</span>
      {{ ": " + countDownSec }}<span class="text-sm text-gray-400">s</span>
    </p>

    <p v-else>
      {{ countDownMin }}<span class="text-sm text-gray-400">m</span>
      {{ ": " + countDownSec }}<span class="text-sm text-gray-400">s</span>
    </p>
  </div>
  <p v-show="showTotalElapsedTime">
    Congrats you wrote for {{ totalElapsedMin }} min {{ totalElapsedSec }} sec
  </p>
  <p v-if="inlog.returningUser.status">
    Congrats you wrote for {{ sessionMinutes[0] }} min
    {{ sessionSeconds[0] }} sec
  </p>
  <!-- instead of a pop up as an option to display it more visible - from primevue -->
  <!-- <div class="card">
        <Message closable>Closable Message</Message>
    </div> -->
</template>
