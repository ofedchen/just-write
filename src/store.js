import { defineStore } from "pinia";
import { ref } from "vue";

export const useInlogStatus = defineStore(
  "inlog",
  () => {
    const status = ref(false);
    const user = ref("");
    const firstname = ref("");
    const surname = ref("");
    const userReturned = ref(false);
    const minutes = ref("");
    const seconds = ref("");

    const logIn = () => {
      status.value = true;
    };

    const logOut = () => {
      status.value = false;
      user.value = "";
      firstname.value = "";
      surname.value = "";
    };

    return {
      status,
      user,
      firstname,
      surname,
      userReturned,
      minutes,
      seconds,
      logIn,
      logOut
    };
  },
  {
    persist: true
  }
);
