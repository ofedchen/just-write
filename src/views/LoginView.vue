<script setup>
  import { ref, watch } from "vue";
  import { useInlogStatus } from "../store/";
  import { useRouter, useRoute } from "vue-router";
  import api from "../api.js";
  import { useToast } from "vue-toastification";
  import { ExclamationCircleIcon } from "@heroicons/vue/24/solid";
  import { EyeIcon } from "@heroicons/vue/24/solid";

  const router = useRouter();
  const route = useRoute();
  const newUsername = ref("");
  const newPasswordFirst = ref("");
  const newPasswordSecond = ref("");
  const toast = useToast();

  const inlog = useInlogStatus();
  const profileCreated = ref(true);
  const completeInlog = ref("#E2E8F0");
  const completeInlogBoolean = ref(false);
  const borderRedGreen = ref("");
  const borderWidth = ref("1");
  const createAccountFilled = ref(false);
  const createAccountFilledColour = ref("#FFF9C4");
  const termsChecked = ref(false);
  const textColor = ref("");
  const loginError = ref(false);
  const passwordIsVisible = ref(false);
  const takenName = ref(false);

  // Här skapar vi profil

  // skicka data till backend

  async function sendUserData() {
    try {
      const response = await api.post(`/auth/signup`, {
        username: newUsername.value,
        password: newPasswordSecond.value
      });
      inlog.logIn(response.data.token, response.data.user.username);
      toast.success("You have successfully created a profile");
      profileCreated.value = true;
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Username taken");
        return;
      }
      console.error("Error creating profile", error);
      toast.error("Profile has not been created");
    }
  }

  const createProfile = async () => {
    await sendUserData();
  };

  const checkUserNameIsTaken = async (newName) => {
    if (!newName || newName.length < 6) {
      takenName.value = false;
      return;
    }

    try {
      const response = await api.get(
        `/auth/check-username/${encodeURIComponent(newName)}`
      );
      takenName.value = !response.data.available;
    } catch (error) {
      console.error("Error checking username", error);
      takenName.value = false;
    }
  };

  const skipCreate = () => {
    profileCreated.value = true;
  };

  const username = ref("");
  const password = ref("");

  //LOG IN
  const loginFunction = async () => {
    try {
      const response = await api.post(`/auth/login`, {
        username: username.value,
        password: password.value
      });

      inlog.logIn(response.data.token, response.data.user.username);

      const toPage =
        typeof route.query.endpoint === "string" ? route.query.endpoint : "/";
      router.push({ path: toPage });
    } catch (error) {
      if (error.response?.status === 401) {
        loginError.value = true;
        return;
      }
      console.error("Error logging in", error);
      loginError.value = true;
    }
  };

  // Logga in del: Kolla så att användarnnamn och lösenord är över 6 tecken

  watch([username, password], ([watchUsername, watchPassword]) => {
    if (watchUsername.length >= 6 && watchPassword.length >= 6) {
      completeInlog.value = "#2d3748";
      completeInlogBoolean.value = true;
      textColor.value = "white";
    } else {
      completeInlog.value = "#E2E8F0";
      completeInlogBoolean.value = false;
      textColor.value = "black";
    }
  });

  // Skapa konto del: Kolla så att användarnamn och lösenord är över 6 tecken och att lösenorden är samma.
  watch(
    [newUsername, newPasswordFirst, newPasswordSecond, termsChecked],
    ([checkUsername, checkPasswordFirst, checkPasswordSecond, watchTerms]) => {
      checkUserNameIsTaken(checkUsername);
      if (
        checkUsername.length >= 6 &&
        !takenName.value &&
        checkPasswordFirst.length >= 6 &&
        checkPasswordFirst === checkPasswordSecond &&
        watchTerms
      ) {
        createAccountFilled.value = true;
        createAccountFilledColour.value = "#FDD835";
      } else {
        createAccountFilled.value = false;
        createAccountFilledColour.value = "#FFF9C4";
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
        borderWidth.value = "2px";
      } else {
        borderRedGreen.value = "";
        borderWidth.value = "2px";
      }
    }
  );

  const skipToCreateProfile = () => {
    profileCreated.value = false;
    loginError.value = false;
  };

  const togglePasswordVisibility = () => {
    if (!passwordIsVisible.value) {
      passwordIsVisible.value = true;
    } else if (passwordIsVisible.value) passwordIsVisible.value = false;
  };
</script>

<template>
  <div
    v-if="loginError"
    class="flex items-center m-auto gap-3 border-b border-red-800 bg-red-100 p-4 shadow-md w-md mb-5"
  >
    <ExclamationCircleIcon class="w-8 h-8 text-red-800" />
    <p class="font-medium text-red-800">Invalid username or password</p>
  </div>
  <form
    v-if="profileCreated"
    @submit.prevent="loginFunction"
    class="flex flex-col max-w-md mb-8 space-y-4 m-auto flex"
  >
    <p class="text-blue-800 mb-1">Username</p>

    <input
      type="text"
      name="username"
      id="username"
      placeholder="Username"
      class="w-[80vw] lg:w-full border-b border-gray-400 p-[0.3em] max-w-md mb-8 space-y-4 m-auto outline-none"
      v-model="username"
    />
    <p class="text-blue-800 mb-1">Password</p>

    <div
      class="w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto flex items-center"
    >
      <input
        :type="!passwordIsVisible ? 'password' : 'text'"
        name="password"
        id="password"
        placeholder="Password"
        class="border-b border-gray-400 p-[0.3em] w-full -mr-10 outline-none"
        v-model="password"
      />
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="cursor-pointer"
      >
        <EyeIcon class="w-8 h-8 mb-4" />
      </button>
    </div>

    <button
      class="p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto cursor-pointer"
      :disabled="!completeInlogBoolean"
      :style="{ backgroundColor: completeInlog, color: textColor }"
      v-if="!inlog.status"
    >
      Sign in
    </button>

    <p
      @click="skipToCreateProfile"
      class="text-blue-800 cursor-pointer m-auto mt-8 pr-2 pl-2 mb-50"
    >
      Not yet a member? Create your profile here!
    </p>
  </form>
  <div class="flex place-content-center m-auto">
    <form
      v-if="!profileCreated"
      @submit.prevent="createProfile"
      class="flex flex-col"
    >
      <p class="text-blue-800 w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        Username
      </p>

      <input
        type="text"
        name="new-username"
        id="new-username"
        placeholder="Enter your new username here"
        class="border-b p-[0.3em] w-[80vw] lg:w-full max-w-md mb-4 space-y-4 m-auto outline-none"
        :class="{
          'border-red-700 border-b-2':
            (newUsername.length > 0 && newUsername.length < 6) || takenName,
          'border-green-800 border-b-2': newUsername.length >= 6
        }"
        v-model="newUsername"
      />
      <p class="text-gray-600 m-auto text-sm mb-5" v-if="takenName">
        Sorry, this username is taken
      </p>
      <p
        class="text-gray-600 m-auto text-sm mb-5"
        v-if="newUsername.length < 6 && newUsername.length > 1"
      >
        The username is too short
      </p>
      <p class="text-blue-800 w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        Password
      </p>

      <div class="w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        <input
          :type="!passwordIsVisible ? 'password' : 'text'"
          name="new-password"
          id="new-password"
          placeholder="Minimum 6 characters"
          :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
          class="border-b border-gray-400 mb-5 p-[0.3em] w-full -mr-10 outline-none"
          v-model="newPasswordFirst"
        />

        <button
          type="button"
          @click="togglePasswordVisibility"
          class="cursor-pointer"
        >
          <EyeIcon class="w-8 h-8 -mb-2" />
        </button>
      </div>
      <p class="text-blue-800 w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        Password
      </p>

      <div
        class="w-[80vw] lg:w-full max-w-md mb-1 space-y-4 m-auto flex items-center"
      >
        <input
          :type="!passwordIsVisible ? 'password' : 'text'"
          name="repeat-password"
          id="repeat-password"
          placeholder="Enter your password again"
          :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
          class="border-b border-gray-400 p-[0.3em] w-full -mr-10 outline-none"
          v-model="newPasswordSecond"
        />

        <button
          type="button"
          @click="togglePasswordVisibility"
          class="cursor-pointer"
        >
          <EyeIcon class="w-8 h-8 mb-4" />
        </button>
      </div>
      <p class="text-gray-600 m-auto text-sm mb-5">
        Password and username must contain atleast 6 characters
      </p>
      <button
        :disabled="!createAccountFilled"
        :style="{ backgroundColor: createAccountFilledColour }"
        class="cursor-pointer p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto pr-3 pl-3"
        :class="createAccountFilled ? '' : 'text-gray-700'"
      >
        Sign up!
      </button>

      <div class="m-auto flex pr-3 pl-3">
        <input
          id="checkbox"
          name="checkbox"
          type="checkbox"
          v-model="termsChecked"
        />
        <label for="checkbox" class="m-auto pr-3 pl-3 cursor-pointer">
          By continuing, you agree to the Terms of Service, and Privacy
          Policy.</label
        >
      </div>

      <p
        @click="skipCreate"
        class="text-blue-800 cursor-pointer m-auto pr-3 pl-3 mb-50"
      >
        Already a member? Sign in here!
      </p>
    </form>
  </div>
</template>
