<script setup>
import { ref, watch } from "vue";

const newUsername = ref("");
const newPasswordFirst = ref("");
const newPasswordSecond = ref("");

const userData = ref([]);
const profileCreated = ref(false);
const logedIn = ref(false);
const completeInlog = ref("#E2E8F0");
const completeInlogBoolean = ref(false);
const borderRedGreen = ref("");
const borderWidth = ref("1");

const createAccountFilled = ref(false);
const createAccountFilledColour = ref("#fef08a");

const createProfile = () => {
  userData.value.push({
    choosenName: newUsername.value,
    choosenPassword: newPasswordSecond.value,
  });
  profileCreated.value = true;
  console.log(userData.value);
};

const skipCreate = () => {
  profileCreated.value = true;
};

const username = ref("");
const password = ref("");

const loginFunction = () => {
  const userDataCheck = userData.value.some(
    (user) =>
      user.choosenName === username.value &&
      user.choosenPassword === password.value
  );

  if (userDataCheck) {
    logedIn.value = true;
    console.log("Användare är inloggad");
  }
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
      v-if="!logedIn"
    >
      Sign in</button
    ><button
      class="bg-green-800 p-[0.3em] w-full max-w-md mb-8 space-y-4 m-auto"
      v-if="logedIn"
    >
      Logged in
    </button>
    <p class="m-auto">
      By continuing, you agree to the Terms of Sale, Terms of Service, and
      Privacy Policy.
    </p>
  </form>
</template>
