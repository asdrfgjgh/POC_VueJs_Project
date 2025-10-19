<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { useLocale } from '@/locale'; // Import useLocale

const userStore = useUserStore();
const router = useRouter();
const { t } = useLocale(); // Gebruik de useLocale composable

// Maak refs voor de formuliervelden
const name = ref('');
const email = ref('');
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Vul het formulier in met de huidige gebruikersgegevens wanneer de component laadt
onMounted(() => {
  if (userStore.user) {
    name.value = userStore.user.name;
    email.value = userStore.user.email;
  }
});

async function handleProfileUpdate() {
  error.value = null;
  successMessage.value = null;
  try {
    await userStore.updateProfile({ name: name.value, email: email.value });
    successMessage.value = t('profileUpdateSuccess');
    // Optioneel: stuur de gebruiker na een paar seconden weg
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (err: any) {
    error.value = err.message || t('profileUpdateFailed');
  }
}
</script>

<template>
  <div class="view-container">
    <div class="auth-form">
      <h2>{{ t('profileEditTitle') }}</h2>
      <form @submit.prevent="handleProfileUpdate">
        <div class="form-group">
          <label for="name">{{ t('nameLabel') }}</label>
          <input id="name" v-model="name" type="text" required />
        </div>
        <div class="form-group">
          <label for="email">{{ t('emailLabel') }}</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <button type="submit">{{ t('saveButton') }}</button>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Deze stijlen zijn gekopieerd van LoginView voor een consistente look */
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
.success-message {
  color: #51cf66;
  margin-top: 1rem;
}
</style>