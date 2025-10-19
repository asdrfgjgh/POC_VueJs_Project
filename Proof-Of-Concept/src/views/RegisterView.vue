<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

async function handleRegister() {
  error.value = null;
  try {
    await userStore.register(name.value, email.value, password.value);
    router.push('/login');
  } catch (err: any) {
    error.value = err.message || 'Registratie mislukt. Probeer het opnieuw.';
  }
}
</script>

<template>
  <div class="view-container">
    <div class="auth-form">
      <h2>Registreren</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Naam</label>
          <input id="name" v-model="name" type="text" required />
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">Wachtwoord</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">Registreren</button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Stijlen voor het formulier */
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #2c2c2c;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
}
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: #fff;
}
button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  background-color: var(--color-accent);
  color: var(--color-background);
  font-weight: bold;
  cursor: pointer;
}
.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
}
</style>