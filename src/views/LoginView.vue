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

const createAccountFilled = ref(false);
const createAccountFilledColour = ref("#fef08a");

const createProfile = () => {
  userData.value.push({
    choosenName: newUsername,
    choosenPassword: newPasswordSecond,
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

watch([username, password], ([watchUsername, watchPassword]) => {
  if (watchUsername.length >= 6 && watchPassword.length >= 6) {
    completeInlog.value = "#2d3748";
    completeInlogBoolean.value = true;
  } else {
    completeInlog.value = "#E2E8F0";
    completeInlogBoolean.value = false;
  }
});

// Kolla så att skapat användarnamn och lösenord är längre än 6 tecken
watch(
  [newUsername, newPasswordFirst, newPasswordSecond],
  ([checkUsername, checkPasswordFirst, checkPasswordSecond]) => {
    if (
      checkUsername.length >= 6 &&
      checkPasswordFirst.length >= 6 &&
      checkUsername.length >= 6 &&
      checkPasswordFirst === checkPasswordSecond
    ) {
      (createAccountFilled.value = true),
        (createAccountFilledColour.value = "#eab308");
    } else {
      (createAccountFilled.value = false),
        (createAccountFilledColour.value = "#fef08a");
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
      class="border bg-gray-200 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
      v-model="newUsername"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Skriv in nytt lösenord"
      class="border bg-tellow-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
      v-model="newPasswordFirst"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Skriv in ditt lösenord igen"
      class="border bg-tellow-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
      v-model="newPasswordSecond"
    />

    <button
      :disabled="!createAccountFilled"
      :style="{ backgroundColor: createAccountFilledColour }"
      class="cursor-pointer p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
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
      class="border border-gray-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
      v-model="username"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Lösenord"
      class="border border-gray-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
      v-model="password"
    />
    <button
      class="p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
      :disabled="!completeInlogBoolean"
      :style="{ backgroundColor: completeInlog }"
      v-if="!logedIn"
    >
      Sign in</button
    ><button
      class="bg-green-800 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19 m-auto"
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
