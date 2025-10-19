import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router'; // Importeer de router

const app = createApp(App);

app.use(createPinia());
app.use(router); // Vertel de app om de router te gebruiken

app.mount('#app');