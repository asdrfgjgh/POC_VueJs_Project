<!-- <script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
import * as api from '../services/api';
import type { IStudent } from '@/types';

const userStore = useUserStore();
const selectedUserId = ref<string | null>(null);

const userOptions = computed(() =>
  userStore.users.map((u: IStudent) => ({
    label: u.name,
    value: u._id,
  }))
);

watch(selectedUserId, (newVal) => {
  if (newVal) {
    userStore.selectUser(newVal);
  }
});

onMounted(async () => {
  const users = await api.getAllStudents();
  userStore.setUsers(users);

  // CORRECTIE: Haal de eerste gebruiker op en controleer of deze bestaat
  const firstUser = users[0];
  if (firstUser) {
    selectedUserId.value = firstUser._id;
  }
});
</script>

<template>
  <div class="user-switcher" v-if="userStore.users.length > 0">
    <select v-model="selectedUserId">
      <option v-for="user in userOptions" :key="user.value" :value="user.value">
        {{ user.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.user-switcher {
  /* Donkere, semi-transparante achtergrond */
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Lijn uit naar rechts */
  gap: 1rem;
}

label {
  font-weight: 500;
  color: var(--color-text-soft);
}

select {
  /* Eigen styling voor de dropdown */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  background-color: var(--color-background-soft);
  color: var(--color-text);
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: 1rem;
  
  /* Pijltje voor de dropdown */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
  transition: border-color 0.3s;
}

select:hover {
  border-color: var(--color-accent);
}
</style> -->