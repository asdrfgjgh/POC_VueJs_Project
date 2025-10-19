<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { useLocale } from '@/locale'; // Import useLocale

const userStore = useUserStore();
const router = useRouter();
const { t } = useLocale(); // Gebruik de useLocale composable

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

async function handleLogin() {
  error.value = null;
  try {
    await userStore.login(email.value, password.value);
    router.push('/'); // Stuur gebruiker naar de homepagina na inloggen
  } catch (err: any) {
    error.value = err.message || t('loginFailed');
  }
}
</script>

<template>
  <div class="view-container">
    <div class="auth-form">
      <h2>{{ t('loginTitle') }}</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">{{ t('emailLabel') }}</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">{{ t('passwordLabel') }}</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">{{ t('loginButton') }}</button>
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
  background-color: #ffffff; /* Pure white background */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Add a subtle shadow */
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333; /* Darker text for contrast */
}
input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff; /* White background for input */
  color: #333;
  font-size: 1em;
}
input:focus {
  outline: none;
  border-color: var(--color-accent); /* Highlight on focus */
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