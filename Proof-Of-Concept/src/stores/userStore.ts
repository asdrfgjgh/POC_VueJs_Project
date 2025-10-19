// src/stores/userStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import * as api from '@/services/api';
import type { IStudent, IChoiceModule } from '@/types';

// Hernoem IStudent naar IUser voor duidelijkheid
export const useUserStore = defineStore('student', () => {
  const user = ref<IStudent | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const currentLanguage = ref<string>(localStorage.getItem('language') || 'NL'); // Standaardtaal

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function setUser(newUser: IStudent) {
    user.value = newUser;
  }

  function setLanguage(lang: string) {
    currentLanguage.value = lang;
    localStorage.setItem('language', lang);
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  async function login(email: string, password: string) {
    const data = await api.loginUser(email, password);
    setToken(data.token);
    setUser(data.student);
  }

  async function register(name: string, email: string, password: string) {
    await api.registerUser(name, email, password);
  }

  function logout() {
    clearAuth();
  }

      async function updateProfile(data: { name: string; email: string; }) {
    if (!user.value) return;

    const updatedUser = await api.updateStudentProfile(user.value._id, data);
    setUser(updatedUser); // Update de state met de nieuwe gebruikersdata
  }
  
  // Behoud je toggleShortlist functie
  async function toggleShortlist(moduleId: string, module: IChoiceModule) {
    if (!user.value) return;

    const isFavorited = user.value.shortlisted_modules.some(m => m._id === moduleId);
    const action = isFavorited ? 'remove' : 'add';
    // Optimistic update
    if (isFavorited) {
      user.value.shortlisted_modules = user.value.shortlisted_modules.filter(m => m._id !== moduleId);
    } else {
      user.value.shortlisted_modules.push(module);
    }

    try {
      // API call naar de backend om de wijziging op te slaan
      await api.updateShortlist(user.value._id, moduleId, action);
      console.log(`Shortlist succesvol bijgewerkt voor gebruiker ${user.value._id}. Actie: ${action}`);
    } catch (error) {
      console.error("Fout bij bijwerken shortlist:", error);
      // Rollback als de API call faalt: zet de staat terug naar hoe die was.
      if (action === 'remove') { // Het verwijderen is mislukt, dus voeg weer toe
        user.value.shortlisted_modules.push(module);
      } else { // Het toevoegen is mislukt, dus verwijder weer
        user.value.shortlisted_modules = user.value.shortlisted_modules.filter(m => m._id !== moduleId);
      }
    }

  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    toggleShortlist,
    updateProfile,
    currentLanguage,
    setLanguage
  };
});