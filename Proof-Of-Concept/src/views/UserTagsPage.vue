<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import * as api from '../services/api';
// 👇 Importeren van de benodigde types
import type { ITag, IChoiceModule } from '../types';
import ModuleRecommendations from '../components/ModuleRecommendations.vue';
import { useLocale } from '@/locale'; // Import useLocale

// Gebruik de user store
const userStore = useUserStore();
// 👇 CORRECTIE 1: 'selectedUser' is nu 'user'
const { user } = storeToRefs(userStore);
const { t } = useLocale(); // Gebruik de useLocale composable

interface TagStat {
  _id: string;
  name: string;
  count: number;
  color: string;
}

const tagStats = ref<TagStat[]>([]);
const allTags = ref<ITag[]>([]);
const isLoading = ref(true);

const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#E7E9ED', '#8D99AE', '#EF233C', '#D90429', '#2B2D42', '#F7B267'
];

// Functie om de statistieken te berekenen
const calculateStats = () => {
  // 👇 Gebruik 'user' in plaats van 'selectedUser'
  if (!user.value || allTags.value.length === 0) {
    tagStats.value = [];
    return;
  }

  const tagCountMap = new Map<string, number>();

  allTags.value.forEach(tag => {
    tagCountMap.set(tag._id, 0);
  });

  // 👇 Gebruik 'user' en voeg types toe
  user.value.shortlisted_modules.forEach((module: IChoiceModule) => {
    if (Array.isArray(module.tags)) {
      module.tags.forEach((tag: string | ITag) => {
        const tagId = typeof tag === 'string' ? tag : tag._id;
        tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
      });
    }
  });

  tagStats.value = allTags.value.map((tag, index) => ({
    _id: tag._id,
    name: tag.name,
    count: tagCountMap.get(tag._id) || 0,
    color: colors[index % colors.length] as string,
  }))
  .sort((a: TagStat, b: TagStat) => b.count - a.count);
};

// Haal alle tags één keer op
api.getAllTags().then(tags => {
  allTags.value = tags;
  calculateStats();
  isLoading.value = false;
}).catch(error => {
  console.error("Fout bij het ophalen van tags:", error);
  isLoading.value = false;
});

// Kijk naar wijzigingen in de ingelogde gebruiker
watch(user, () => {
  calculateStats();
}, { deep: true });

const chartData = computed(() => {
  return {
    labels: tagStats.value.map(t => t.name),
    datasets: [
      {
        backgroundColor: tagStats.value.map(t => t.color),
        data: tagStats.value.map(t => t.count),
      },
    ],
  };
});

const hasFavorites = computed(() => {
  // 👇 Gebruik 'user'
  return user.value && user.value.shortlisted_modules.length > 0;
});
</script>

<template>
  <div class="view-container user-tags-view">
    <h1>
      {{ t('myFavoritesTitle') }}<span v-if="user"> {{ t('forLabel') }} {{ user.name }}</span>
    </h1>
    <div v-if="isLoading" class="loading">
      <span>{{ t('loadingData') }}</span>
    </div>
    <div v-else-if="!user" class="no-user-selected">
      <h2>{{ t('loginToViewStats') }}</h2>
    </div>
    <div v-else-if="!hasFavorites" class="no-favorites">
      <h2>{{ t('noFavoriteModules') }}</h2>
      <p>{{ t('goToModulesPage') }}</p>
    </div>
    <div v-else class="content-wrapper">
      <div class="dashboard-grid">
        <div class="legend-container">
          <h2>{{ t('legend') }}</h2>
          <ul class="tag-legend">
            <li v-for="tag in tagStats.filter(t => t.count > 0)" :key="tag._id">
              <span class="color-box" :style="{ backgroundColor: tag.color }"></span>
              <span class="tag-name">{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }}</span>
            </li>
          </ul>
        </div>
        <div class="chart-container">
          
        </div>
      </div>
      <ModuleRecommendations :shortlisted-modules="user.shortlisted_modules" />
    </div>
  </div>
</template>

<style scoped>
/* Deze pagina heeft een unieke layout, dus de scoped styles kunnen blijven. */
/* Ik heb de kleuren aangepast naar je nieuwe CSS variabelen. */

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: flex-start;
}

.legend-container {
  background-color: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.legend-container h2 {
  margin-top: 0;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.tag-legend {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-legend li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 4px;
}

.tag-name {
  font-weight: bold;
  flex-grow: 1;
  color: var(--color-text);
}

.tag-count {
  font-weight: bold;
  color: #fff;
  background-color: var(--color-accent);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.9em;
}

.chart-container {
  position: relative;
  height: 50vh;
  min-height: 400px;
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.loading, .no-user-selected, .no-favorites {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-soft);
  margin-top: 4rem;
}
</style>