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
const { user } = storeToRefs(userStore);
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

function handleCardClick() {
  emit('view-details', props.module);
}
</script>

<template>
  <div class="hero-container clickable-card" @click="handleCardClick">
    <div class="hero-image">
      <img :src="getImageUrl(module._id)" :alt="t('imageAltText') + module.name" />
    </div>
    <div class="hero-content">
      <div class="course-info">
        <h2 class="course-title">
          {{ module.name }}
          <button class="favorite-button" @click.stop="handleFavoriteClick">
            <span>{{ isFavorite ? '⭐' : '☆' }}</span>
          </button>
        </h2>
        <p class="course-description">{{ module.description }}</p>
        <p><strong>{{ t('studyPointsLabel') }}</strong> {{ module.studycredit }} ECTS</p>
      </div>

      <div class="tags-container" v-if="module.tags && module.tags.length > 0">
        <span v-for="tag in module.tags" :key="tag._id" class="tag">
          {{ tag.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.hero-container {
  display: flex;
  align-items: stretch;
  border-radius: 8px;
  overflow: hidden;
  min-height: 250px; /* Maak de kaart langer */
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.clickable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.hero-image {
  flex: 0 0 250px; /* Geef de afbeelding meer ruimte */
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
}

.course-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* 👇 CORRECTIE 3: Standaard 'line-clamp' toegevoegd */
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.4em;
  max-height: calc(1.4em * 3); 
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background-color: var(--color-accent);
  color: var(--color-background);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>