<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { isAuthenticated, user } = storeToRefs(userStore);
const router = useRouter();

// Nieuwe state om de zichtbaarheid van de dropdown te beheren
const isDropdownOpen = ref(false);

function handleLogout() {
  userStore.logout();
  isDropdownOpen.value = false; // Sluit dropdown na uitloggen
  router.push('/login');
}

// Functie om de dropdown te sluiten als er ergens anders wordt geklikt
function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<template>
  <div id="app-background" @click="closeDropdown"></div>
  <header>
    <div class="wrapper">
      <nav>
        <div class="nav-left">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/modules">Modules</RouterLink>
          <RouterLink v-if="isAuthenticated" to="/user-tags">Mijn Tags</RouterLink>
        </div>

        <div class="nav-right">
          <template v-if="!isAuthenticated">
            <RouterLink to="/login">Inloggen</RouterLink>
            <RouterLink to="/register">Registreren</RouterLink>
          </template>
          <template v-else>
            <span class="welcome-message">Welkom, {{ user?.name }}</span>
            
            <div class="profile-dropdown">
              <button @click.stop="isDropdownOpen = !isDropdownOpen" class="profile-link" title="Profiel">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.38 0 2.5 1.12 2.5 2.5S13.38 10 12 10s-2.5-1.12-2.5-2.5S10.62 5 12 5zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.88 6-3.88s5.97 1.89 6 3.88c-1.29 1.94-3.5 3.22-6 3.22z"/>
                 </svg>
              </button>
              <div v-if="isDropdownOpen" class="dropdown-menu">
  <RouterLink to="/profile" @click="closeDropdown">Profiel Bewerken</RouterLink>
  <RouterLink to="/favorites" @click="closeDropdown">Mijn Favorieten</RouterLink>
  <a @click="handleLogout" class="logout-button">Uitloggen</a>
</div>
            </div>
          </template>
        </div>
      </nav>
    </div>
  </header>

  <RouterView @click="closeDropdown" />
</template>

<style scoped>
#app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
  background-color: var(--color-background);
}

#app-background::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  background-color: #c41e1e;
  box-shadow: 0 0 80px 40px var(--color-accent);
  opacity: 0.35;
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}

header {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

nav {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: var(--color-text-soft);
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-color 0.3s;
  text-decoration: none;
}

nav a:hover {
  color: var(--color-text);
  border-bottom-color: var(--color-accent-hover);
}

nav a.router-link-exact-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.logout-button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: var(--color-text-soft);
  border-bottom: 2px solid transparent;
}

.logout-button:hover {
  color: var(--color-text);
  border-bottom-color: var(--color-accent-hover);
}

.welcome-message {
  color: var(--color-text);
  padding: 0.5rem 0.5rem 0.5rem 1rem;
}

.profile-dropdown {
  position: relative; /* Noodzakelijk om het menu correct te positioneren */
}

.profile-link {
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  width: 40px;
  height: 60px;
  padding: 0.25rem;
  color: var(--color-accent);
  transition: all 0.2s ease-in-out;
  border-radius: 50%;
  box-sizing: border-box;
}


.profile-link:hover {
  color: var(--color-text); /* Verandert naar wit/grijze tekstkleur bij hover */
  transform: scale(1.1);
}

.profile-link svg {
  width: 50px; /* Grootte van het SVG-icoon */
  height: 50px;
  fill: currentColor; /* Zorgt ervoor dat de SVG de 'color' van de parent overneemt */
}

.dropdown-menu {
  position: absolute;
  top: 120%; /* Net onder de knop */
  right: 0;
  background-color: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 10;
  overflow: hidden; /* Zorgt dat de links binnen de ronde hoeken blijven */
  display: flex;
  flex-direction: column;
  width: max-content; /* Past de breedte aan op de inhoud */
}

.dropdown-menu a {
  padding: 0.75rem 1.5rem;
  color: var(--color-text-soft);
  text-align: left;
  border-bottom: none; /* Verwijder de hover-lijn van de algemene 'nav a' */
  width: 100%;
  box-sizing: border-box;
}

.dropdown-menu a:hover {
  background-color: var(--color-accent);
  color: #fff;
  border-bottom: none;
}


</style>