<!-- SOOURCES:

https://geekiebarbs.hashnode.dev/build-a-countdown-app-with-vuejs-using-composition-api
https://www.w3schools.com/howto/howto_js_countdown.asp
https://www.w3schools.com/jsref/met_win_setinterval.asp
https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval

 -->


 <script setup>
 import { ref, computed, onMounted, onBeforeUnmount } from "vue";
 
 const now = ref(new Date().getTime());
 const countDownTime = ref(now.value + 120000); //  milliseconds from now
 const timeRemaining = ref(countDownTime.value - now.value);
 
 const min = computed(() => Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60)));
 const sec = computed(() => Math.floor((timeRemaining.value % (1000 * 60)) / 1000));
 
 let interval;
 
 const startTimer = () => {
   interval = setInterval(() => {
     now.value = new Date().getTime();
      timeRemaining.value = Math.max(0, countDownTime.value - now.value);  
   }, 1000);
 };
 // start timer on mount
 onMounted(startTimer); 
 
 // not necessary, best practice. makes sure countdown stops and does not run i background.
 onBeforeUnmount(() => {
   clearInterval(interval);
 }

);
 </script>
 
 <template>
   <div>
     <p>Countdown: {{ min }} min {{ sec }} sec</p>
   </div>
 </template>