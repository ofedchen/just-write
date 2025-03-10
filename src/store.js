import { defineStore } from "pinia";
import { ref } from "vue";

export const useInlogStatus = defineStore(
  "inlog",
  () => {
    const status = ref(false);
    const user = ref("");
    // const firstname = ref("");
    // const surname = ref("");
    // const userReturned = ref({ status: false, action: "" });
    const returningUser = ref({ status: false, action: "" });
    const minutes = ref(null);
    const seconds = ref(null);

    const logIn = () => {
      status.value = true;
    };

    const logOut = () => {
      status.value = false;
      user.value = "";
      // firstname.value = "";
      // surname.value = "";
      minutes.value = null;
      seconds.value = null;
      // userReturned.value = { status: false, action: "" };
      returningUser.value = { status: false, action: "" };
    };

    return {
      status,
      user,
      // firstname,
      // surname,
      // userReturned,
      returningUser,
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
