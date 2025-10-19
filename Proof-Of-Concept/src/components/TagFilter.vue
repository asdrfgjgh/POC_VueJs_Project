<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as api from '../services/api';
// CORRECTIE: Het type 'Tag' is aangepast naar 'ITag'
import type { ITag } from '../types';
import { useLocale } from '@/locale'; // Import useLocale

// CORRECTIE: Het type 'Tag' is aangepast naar 'ITag'
const tags = ref<ITag[]>([]);
const selectedTags = ref<string[]>([]);

const emit = defineEmits(['tags-updated']);

const { t } = useLocale(); // Gebruik de useLocale composable

onMounted(async () => {
  tags.value = await api.getAllTags();
});

const handleTagChange = () => {
  emit('tags-updated', selectedTags.value);
};
</script>

<template>
  <div class="filter-container">
    <h4>{{ t('filterByTags') }}</h4>
    <div class="tags">
      <label v-for="tag in tags" :key="tag._id">
        <input
          type="checkbox"
          :value="tag._id"
          v-model="selectedTags"
          @change="handleTagChange"
        />
        {{ tag.name }}
      </label>
    </div>
  </div>
</template>

<style scoped>
/* --- 1. Algemene Container Styling --- */
.filter-container {
  background-color: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

h4 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

/* --- 2. Tags Layout --- */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* Ruimte tussen de tags */
}

/* --- 3. Checkbox & Label Styling --- */
.tags label {
  display: flex;
  align-items: center;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #000000; /* Changed from var(--color-text-soft) to black */
}

.tags label:hover {
  border-color: var(--color-accent);
  color: #000000; /* Changed from var(--color-text) to black */
}

/* De standaard checkbox, maar dan mooier */
.tags input[type='checkbox'] {
  /* Verwijdert het standaard uiterlijk */
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--color-background-mute);
  margin: 0;
  margin-right: 0.75rem;
  
  /* Afmetingen en vorm */
  width: 1.25em;
  height: 1.25em;
  border: 2px solid var(--color-border-hover);
  border-radius: 4px;
  
  /* Plaatsing van het vinkje */
  display: grid;
  place-content: center;
  transition: background-color 0.2s, border-color 0.2s;
}

/* Het vinkje zelf (een pseudo-element) */
.tags input[type='checkbox']::before {
  content: '';
  width: 0.75em;
  height: 0.75em;
  transform: scale(0);
  transition: transform 0.1s ease-in-out;
  /* Het vinkje is een rood vierkantje */
  background-color: var(--color-accent);
  border-radius: 2px;
}

/* --- De Magie: Rode accenten als de checkbox is aangevinkt --- */
.tags input[type='checkbox']:checked {
  border-color: var(--color-accent);
}

.tags input[type='checkbox']:checked::before {
  /* Maak het vinkje zichtbaar */
  transform: scale(1);
}

/* Maak de tekst van een geselecteerde tag duidelijker */
.tags input[type='checkbox']:checked + * {
  color: var(--color-text);
  font-weight: 600;
}
</style>