import { defineStore } from "pinia";
import { ref } from "vue";

export const useInlogStatus = defineStore(
  "inlog",
  () => {
    const status = ref(false);
    const user = ref("");
    const firstname = ref("");
    const surname = ref("");

    const logIn = () => {
      status.value = true;
    };

    const logOut = () => {
      status.value = false;
      user.value = "";
    };

    return { status, user, firstname, surname, logIn, logOut };
  },
  {
    persist: true
  }
);
