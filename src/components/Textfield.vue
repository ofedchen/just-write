<script setup>
  import { ref, defineEmits } from 'vue'
  import { useToast } from 'vue-toastification'

  const userText = ref('')
  const storedTexts = ref(null)

  const props = defineProps({
    currentPrompt: String,
    hidden: Boolean
  })

  const toast = useToast()

  function saveText() {
    if (!userText.value.trim()) {
      toast.error("There's nothing to save yet - keep writing!")
      return
    }
    const savedText = {
      id: Date.now(),
      prompt: props.hidden ? 'Free writing' : props.currentPrompt,
      text: userText.value,
      date: new Date().toLocaleDateString('se-SV')
    }

    storedTexts.value = JSON.parse(localStorage.getItem('savedTexts')) || []
    storedTexts.value.push(savedText)
    localStorage.setItem('savedTexts', JSON.stringify(storedTexts.value))
    toast.success('Your text is now saved!')
    userText.value = ''
  }

  const emit = defineEmits(['textStarted'])

  function checkText() {
    if (userText.value.trim()) {
      emit('textStarted', userText.value)
    }
  }
</script>

<template>
  <form @submit.prevent="saveText" class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <textarea
        @input="checkText"
        v-model="userText"
        placeholder="Write whatever you want. Your goal is to write for 2 minutes, but don't limit yourself."
        name="userText"
        rows="13"
        cols="1"
        class="block p-2.5 w-full text-[1.1em] text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <button
      type="submit"
      severity="secondary"
      label="Save text"
      class="px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
    >
      Save text
    </button>
  </form>
</template>
