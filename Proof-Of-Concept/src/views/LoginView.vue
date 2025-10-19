<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

async function handleLogin() {
  error.value = null;
  try {
    await userStore.login(email.value, password.value);
    router.push('/'); // Stuur gebruiker naar de homepagina na inloggen
  } catch (err: any) {
    error.value = err.message || 'Inloggen mislukt. Controleer je gegevens.';
  }
}
</script>

<template>
  <div class="view-container">
    <div class="auth-form">
      <h2>Inloggen</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">Wachtwoord</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">Inloggen</button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Je kunt dezelfde stijlen hergebruiken als in RegisterView */
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