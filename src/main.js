import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(Toast)
app.use(pinia)
app.mount('#app')
