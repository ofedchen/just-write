import { defineStore } from "pinia";
import { ref } from "vue";

export const useInlogStatus = defineStore(
  "inlog",
  () => {
    const status = ref(false);

    const logIn = () => {
      status.value = true;
    };

    const logOut = () => {
      status.value = false;
    };

    return { status, logIn, logOut };
  },
  {
    persist: true,
  }
);
