<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useLocale } from '@/locale'; // Import useLocale
import type { IChoiceModule } from '@/types';
import { storeToRefs } from 'pinia'; // Importeer storeToRefs

const userStore = useUserStore();

const { user, isAuthenticated } = storeToRefs(userStore); // Voeg isAuthenticated toe
// Dit component verwacht een 'module' object als prop
const props = defineProps<{
  module: IChoiceModule;
}>();

// Defineert een 'close' event dat we kunnen aanroepen om de weergave te sluiten
const emit = defineEmits(['close']);

const { t } = useLocale(); // Gebruik de useLocale composable

const isFavorite = computed(() => {
  // 👇 CORRECTIE: Gebruik optional chaining (?.) om veilig de property te benaderen.
  // Als 'user.value' null is, stopt de expressie en wordt 'false' teruggegeven.
  return user.value?.shortlisted_modules.some(
    (m: IChoiceModule) => m._id === props.module._id
  ) ?? false;
});

function handleFavoriteClick() {
  userStore.toggleShortlist(props.module._id, props.module);
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="module-title">{{ module.name }}</h2>
        <button v-if="isAuthenticated" class="favorite-button" @click="handleFavoriteClick">
          <span>{{ isFavorite ? '⭐' : '☆' }}</span>
        </button>
        <button class="close-button" @click="handleClose">×</button>
      </div>
      
      <div class="modal-body">
        
        <div class="details-grid">
          <div><strong>{{ t('studyPoints') }}:</strong> {{ module.studycredit }} ECTS</div>
          <div><strong>{{ t('location') }}:</strong> {{ module.location || t('notSpecified') }}</div>
          <div><strong>{{ t('level') }}:</strong> {{ module.level || t('notSpecified') }}</div>
        </div>

        <div v-if="module.content" class="module-section">
          <h3>{{ t('content') }}</h3>
          <p>{{ module.content }}</p>
        </div>

        <div v-if="module.learningoutcomes" class="module-section">
          <h3>{{ t('learningOutcomes') }}</h3>
          <p>{{ module.learningoutcomes }}</p>
        </div>

        <div class="tags-container" v-if="module.tags && module.tags.length > 0">
          <h3>{{ t('tags') }}</h3>
          <span v-for="tag in module.tags" :key="tag._id" class="tag">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #f9f9f9; /* Lichter grijs/wit */
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.module-title {
  color: #333; /* Donkerder tekst voor lichte achtergrond */
  margin: 0;
  flex-grow: 1;
}

.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 1rem;
}

.close-button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.close-button:hover {
  color: #fff;
}

.modal-body p {
  color: #555; /* Donkerder tekst voor lichte achtergrond */
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f0f0f0; /* Lichter grijs */
  border-radius: 4px;
}

.details-grid div {
  color: #333; /* Donkerder tekst voor lichte achtergrond */
}

.details-grid div strong {
  color: #1a1a1a; /* Very dark grey for labels */
}

.module-section {
  margin-top: 1.5rem;
}

.module-section h3 {
  color: #333; /* Donkerder tekst voor lichte achtergrond */
  border-bottom: 1px solid #bbb;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.tags-container {
  margin-top: 1.5rem;
}

.tags-container h3 {
   color: #333; /* Donkerder tekst voor lichte achtergrond */
   margin-bottom: 1rem;
}

.tag {
  display: inline-block;
  background-color: var(--color-accent);
  color: var(--color-background);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>