<script setup>
  import { ref, watch, onMounted } from "vue";
  import { useInlogStatus } from "../store/";
  import { useRouter, useRoute } from "vue-router";
  import axios from "axios";
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
  const jsonUserData = ref([]);
  const createAccountFilled = ref(false);
  const createAccountFilledColour = ref("#fef08a");
  const termsChecked = ref(false);
  const textColor = ref("");
  const loginError = ref(false);
  const passwordIsVisible = ref(false);
  const firstname = ref("");
  const surname = ref("");

  // Här skapar vi profil

  // skicka data till json

  async function sendUserData() {
    const users = {
      username: newUsername.value,
      password: newPasswordSecond.value,
      firstname: firstname.value,
      surname: surname.value
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

  const createProfile = async () => {
    await sendUserData();
    profileCreated.value = true;
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
      const foundUser = jsonUserData.value.find(
        (user) =>
          user.username === username.value && user.password === password.value
      );

      if (foundUser) {
        inlog.user = foundUser.username;
        inlog.firstname = foundUser.firstname;
        inlog.surname = foundUser.surname;
      }
    } catch (error) {
      console.error("Error fetching userData", error);
    }
  };

  const loginFunction = async () => {
    await fetchUserData();

    const userDataCheck = jsonUserData.value.some(
      (user) =>
        user.username === username.value && user.password === password.value
    );

    if (userDataCheck) {
      inlog.logIn();

      inlog.user = username.value;

      const toPage = route.query.endpoint ? "/savedtexts" : "/";
      router.push({ path: toPage });
    } else {
      loginError.value = true;
    }
  };

  // Logga in del: Kolla så att användarnnamn och lösenord är över 6 tecken
  watch(
    [username, password, termsChecked],
    ([watchUsername, watchPassword, watchTerms]) => {
      if (
        watchUsername.length >= 6 &&
        watchPassword.length >= 6 &&
        watchTerms
      ) {
        completeInlog.value = "#2d3748";
        completeInlogBoolean.value = true;
        textColor.value = "white";
      } else {
        completeInlog.value = "#E2E8F0";
        completeInlogBoolean.value = false;
        textColor.value = "black";
      }
    }
  );

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
        createAccountFilledColour.value = "#fef9c3";
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
    <p class="text-blue-800 mb-1" v-if="username">Username</p>

    <input
      type="text"
      name=""
      id=""
      placeholder="Username"
      class="w-[80vw] lg:w-full border-b border-gray-400 p-[0.3em] max-w-md mb-8 space-y-4 m-auto outline-none"
      v-model="username"
    />
    <p class="text-blue-800 mb-1" v-if="password">Password</p>

    <div
      class="w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto flex items-center"
    >
      <input
        :type="!passwordIsVisible ? 'password' : 'text'"
        name=""
        id=""
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
    <p class="m-auto pr-3 pl-3">
      <input type="checkbox" v-model="termsChecked" />
      By continuing, you agree to the Terms of Service, and Privacy Policy.
    </p>

    <p
      @click="skipToCreateProfile"
      class="text-blue-800 cursor-pointer m-auto mt-8 pr-2 pl-2 mb-50"
    >
      Not yet a member? Create your profile here!
    </p>
  </form>

  <form
    v-if="!profileCreated"
    @submit.prevent="createProfile"
    class="flex flex-col"
  >
    <input
      type="text"
      name=""
      id=""
      placeholder="Enter your firstname here"
      class="border-b bg-gray-200 p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto outline-none"
      v-model="firstname"
    />

    <input
      type="text"
      name=""
      id=""
      placeholder="Enter your surname here"
      class="border-b bg-gray-200 p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto outline-none"
      v-model="surname"
    />

    <input
      type="text"
      name=""
      id=""
      placeholder="Enter your new username here"
      class="border-b p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto outline-none"
      v-model="newUsername"
    />

    <div
      class="w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto flex items-center"
    >
      <input
        :type="!passwordIsVisible ? 'password' : 'text'"
        name=""
        id=""
        placeholder="Enter your password here"
        :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
        class="border-b border-gray-400 p-[0.3em] w-full -mr-10 outline-none"
        v-model="newPasswordFirst"
      />

      <button
        type="button"
        @click="togglePasswordVisibility"
        class="cursor-pointer"
      >
        <EyeIcon class="w-8 h-8 mb-4" />
      </button>
    </div>

    <div
      class="w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto flex items-center"
    >
      <input
        :type="!passwordIsVisible ? 'password' : 'text'"
        name=""
        id=""
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

    <button
      :disabled="!createAccountFilled"
      :style="{ backgroundColor: createAccountFilledColour }"
      class="cursor-pointer p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto pr-3 pl-3"
    >
      Sign up!
    </button>

    <p
      @click="skipCreate"
      class="text-blue-800 cursor-pointer m-auto pr-3 pl-3 mb-50"
    >
      Already a member? Sign in here!
    </p>
  </form>
</template>
