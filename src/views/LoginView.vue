<script setup>
  import { ref, watch, onMounted } from "vue";
  import { useInlogStatus } from "../store/";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import { useToast } from "vue-toastification";

  const router = useRouter();
  const newUsername = ref("");
  const newPasswordFirst = ref("");
  const newPasswordSecond = ref("");
  const toast = useToast();

  const inlog = useInlogStatus();
  const profileCreated = ref(false);
  const completeInlog = ref("#E2E8F0");
  const completeInlogBoolean = ref(false);
  const borderRedGreen = ref("");
  const borderWidth = ref("1");
  const jsonUserData = ref([]);

  const createAccountFilled = ref(false);
  const createAccountFilledColour = ref("#fef08a");

  // Här skapar vi profil

  // skicka data till json

  async function sendUserData() {
    const users = {
      userId: "user_" + new Date().getTime(),
      username: newUsername.value,
      password: newPasswordSecond.value
    };

    try {
      const response = await axios.post(`/api/userInfo`, users);
      toast.success("You have successfully created a profile");
    } catch (error) {
      console.error("Error creating profile", error);
      toast.error("Profile has not been created");
    }
  }
  // spara användardata även lokalt

  const createProfile = () => {
    sendUserData();
    profileCreated.value = true;
    console.log(newUsername.value);
  };

  const skipCreate = () => {
    profileCreated.value = true;
  };

  const username = ref("");
  const password = ref("");

  // hämta användardata från json

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/userInfo`);
      jsonUserData.value = response.data;
      console.log(jsonUserData.value);
    } catch (error) {
      console.error("Error fetching userData", error);
    }
  };

  const loginFunction = () => {
    fetchUserData();

    const userDataCheck = jsonUserData.value.some(
      (user) =>
        user.username === username.value && user.password === password.value
    );

    if (userDataCheck) {
      router.push({ path: "profile" });
      inlog.logIn();

      console.log("Användare är inloggad");
    }
    inlog.user = username.value;
  };
  // Logga in del: Kolla så att användarnnamn och lösenord är över 6 tecken
  watch([username, password], ([watchUsername, watchPassword]) => {
    if (watchUsername.length >= 6 && watchPassword.length >= 6) {
      completeInlog.value = "#2d3748";
      completeInlogBoolean.value = true;
    } else {
      completeInlog.value = "#E2E8F0";
      completeInlogBoolean.value = false;
    }
  });

  // Skapa konto del: Kolla så att användarnamn och lösenord är över 6 tecken och att lösenorden är samma.
  watch(
    [newUsername, newPasswordFirst, newPasswordSecond],
    ([checkUsername, checkPasswordFirst, checkPasswordSecond]) => {
      if (
        checkUsername.length >= 6 &&
        checkPasswordFirst.length >= 6 &&
        checkPasswordFirst === checkPasswordSecond
      ) {
        createAccountFilled.value = true;
        createAccountFilledColour.value = "#eab308";
      } else {
        createAccountFilled.value = false;
        createAccountFilledColour.value = "#fef08a";
      }

      if (checkPasswordFirst && checkPasswordSecond) {
        if (
          checkPasswordFirst === checkPasswordSecond &&
          checkPasswordFirst.length >= 6
        ) {
          borderRedGreen.value = "#166534";
        } else {
          borderRedGreen.value = "#991b1b";
        }
        borderWidth.value = "3px";
      } else {
        borderRedGreen.value = "";
        borderWidth.value = "1px";
      }
    }
  );

  // fixa så att inloggad användare får welcome plus användarnnamn
  onMounted(() => {
    console.log(inlog.user);
  });
</script>

<template>
  <form
    v-if="!profileCreated"
    @submit.prevent="createProfile"
    class="flex flex-col"
  >
    <input
      type="text"
      name=""
      id=""
      placeholder="Skriv in nytt användarnamn"
      class="border bg-gray-200 p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      v-model="newUsername"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Skriv in nytt lösenord"
      :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
      class="border p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      v-model="newPasswordFirst"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Skriv in ditt lösenord igen"
      :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
      class="border p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      v-model="newPasswordSecond"
    />

    <button
      :disabled="!createAccountFilled"
      :style="{ backgroundColor: createAccountFilledColour }"
      class="cursor-pointer p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
    >
      Sign up!
    </button>
    <p
      v-if="!profileCreated"
      @click="skipCreate"
      class="text-blue-800 cursor-pointer m-auto"
    >
      Already have an account?
    </p>
  </form>

  <form
    v-if="profileCreated"
    @submit.prevent="loginFunction"
    class="flex flex-col"
  >
    <input
      type="text"
      name=""
      id=""
      placeholder="Användarnamn"
      class="border border-gray-400 p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      v-model="username"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Lösenord"
      class="border border-gray-400 p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      v-model="password"
    />
    <button
      class="p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      :disabled="!completeInlogBoolean"
      :style="{ backgroundColor: completeInlog }"
      v-if="!inlog.status"
    >
      Sign in
    </button>
    <p class="m-auto">
      By continuing, you agree to the Terms of Sale, Terms of Service, and
      Privacy Policy.
    </p>
  </form>
</template>
