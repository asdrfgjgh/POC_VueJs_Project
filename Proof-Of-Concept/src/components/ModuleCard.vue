<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import type { IChoiceModule } from '@/types';
import { useLocale } from '@/locale'; // Import useLocale

// Defineert de events die dit component kan uitzenden
const emit = defineEmits(['view-details']);

const userStore = useUserStore();
// 👇 CORRECTIE 1: 'selectedUser' is nu 'user'
const { user, isAuthenticated } = storeToRefs(userStore); // Voeg isAuthenticated toe
const { t } = useLocale(); // Gebruik de useLocale composable

const props = defineProps<{
  module: IChoiceModule;
}>();

const isFavorite = computed(() => {
  // 👇 Gebruik 'user' in plaats van 'selectedUser'
  if (!user.value) {
    return false;
  }
  // 👇 Gebruik 'user' en voeg een expliciet type 'm' toe
  return user.value.shortlisted_modules.some(
    (m: IChoiceModule) => m._id === props.module._id
  );
});

function stringToHash(str: string): number {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getImageUrl(moduleId: string): string {
  const seed = stringToHash(moduleId);
  return `https://picsum.photos/seed/${seed}/400/300`;
}

function handleFavoriteClick() {
  userStore.toggleShortlist(props.module._id, props.module);
}

function handleMoreInfoClick(event: Event) {
  event.stopPropagation(); // Stop de event bubbeling
  emit('view-details', props.module);
}
</script>

<template>
  <div class="module-card">
    <div class="card-image-container">
      <img :src="getImageUrl(module._id)" :alt="t('imageAltText') + module.name" class="card-image" />
      <div class="level-credits-badges">
        <span class="badge level-badge" v-if="module.level">{{ t('levelFilter') }} {{ module.level }}</span>
        <span class="badge credits-badge" v-if="module.studycredit">{{ t('studyCreditsFilter') }} {{ module.studycredit }}</span>
      </div>
      <button v-if="isAuthenticated" class="favorite-button" @click.stop="handleFavoriteClick">
        <span>{{ isFavorite ? '⭐' : '☆' }}</span>
      </button>
    </div>
    <div class="card-content">
      <h2 class="module-title">{{ module.name }}</h2>
      <p class="module-description">{{ module.description }}</p>

      <div class="tags-container" v-if="module.tags && module.tags.length > 0">
        <span v-for="tag in module.tags" :key="tag._id" class="tag-enhanced">
          {{ tag.name }}
        </span>
      </div>

      <div class="card-actions">
        <button @click="handleMoreInfoClick" class="info-button">{{ t('moreInfoButton') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: none;
}


.card-image-container {
  position: relative;
  width: 100%;
  height: 200px; /* Vaste hoogte voor de afbeelding */
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.level-credits-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.badge {
  background-color: #f0f0f0; /* Lichtgrijze achtergrond */
  color: #333; /* Donkere tekstkleur */
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white; /* Witte achtergrond */
  border: 1px solid #e60000; /* Rode rand */
  color: #e60000; /* Rode ster */
  font-size: 1.2rem;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
}

.favorite-button span {
  margin-left: 5px;
  font-weight: bold;
}

.favorite-button:hover {
  background-color: #e60000;
  color: white;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.module-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a1a; /* Donkergrijs */
  margin-bottom: 0.5rem;
}

.module-description {
  font-size: 0.95rem;
  color: #555555; /* Zachtere donkergrijs */
  line-height: 1.5;
  margin-bottom: 1rem;
  flex-grow: 1; /* Zorgt ervoor dat de beschrijving de beschikbare ruimte inneemt */
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.tag-enhanced {
  background-color: #f0f0f0; /* Light gray background */
  color: #333; /* Darker text for better contrast */
  padding: 0.4rem 0.9rem; /* Increased padding */
  border-radius: 20px; /* More rounded, pill-like shape */
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Subtle shadow */
  transition: all 0.2s ease;
}

.tag-enhanced:hover {
  background-color: #e0e0e0; /* Slightly darker on hover */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12); /* Increased shadow on hover */
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
  justify-content: center;
}

.info-button {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: center;
  width: calc(50% - 1.5rem); /* Half the width of the card's content area */
  background-color: #3e8ed0; /* Blauw */
  border: none;
  color: white;
}

.info-button:hover {
  background-color: #357ABD;
  color: white;
}
</style>