<script setup>
  defineProps({
    currentPrompt: String,
    hidden: Boolean
  })

  const emit = defineEmits(['newPrompt', 'hidePrompt'])

  const newPrompt = () => {
    emit('newPrompt')
  }

  const hidePrompt = () => {
    emit('hidePrompt')
  }
</script>

<template>
  <div
    v-show="!hidden"
    class="relative px-4 lg:px-8 py-8 bg-gray-50/50 rounded-lg border border-gray-300"
  >
    <h2 class="font-[Overpass] text-[1.3em] font-semibold">Random Prompt</h2>
    <i
      class="pi pi-times p-5 cursor-pointer absolute -top-1 right-0"
      style="font-size: 1.6em"
      @click="hidePrompt"
    />
    <p class="py-8 text-[1.1em]">{{ currentPrompt }}</p>
    <button
      @click="newPrompt"
      class="focus:outline-none text-[#212427] bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-8 cursor-pointer"
    >
      Change prompt
    </button>
    <slot />
  </div>
</template>

<style></style>
