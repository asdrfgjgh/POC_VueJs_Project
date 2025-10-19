<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
import * as api from '../services/api';
import { storeToRefs } from 'pinia';
import ModuleCard from '../components/ModuleCard.vue';
import TagFilter from '../components/TagFilter.vue';
import PaginationControls from '../components/PaginationControls.vue';
import type { IChoiceModule } from '../types';
import ModuleDetail from '@/components/ModuleDetail.vue';
import { useLocale } from '@/locale'; // Import useLocale

const selectedModule = ref<IChoiceModule | null>(null);
const userStore = useUserStore();
const choiceModules = ref<IChoiceModule[]>([]);

// Filter states
const selectedTags = ref<string[]>([]);
const selectedLevel = ref<string>('');
const selectedLocation = ref<string>('');
const selectedStudyCredits = ref<number | null>(null);
const searchQuery = ref<string>(''); // Nieuwe ref voor zoekterm

// NIEUWE REFS VOOR FILTEROPTIES
const levels = ref<string[]>([]);
const locations = ref<string[]>([]);
const studyCredits = ref<number[]>([]);

// Paginering state
const currentPage = ref(1);
const itemsPerPage = ref(9);
const totalItems = ref(0);

function viewModuleDetails(module: IChoiceModule) {
  selectedModule.value = module;
}

function closeModuleDetails() {
  selectedModule.value = null;
}

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

const fetchModules = async () => {
  const { modules, total } = await api.getAllModules(
    currentPage.value,
    itemsPerPage.value,
    selectedTags.value,
    selectedLevel.value,
    selectedLocation.value,
    selectedStudyCredits.value ?? undefined,
    searchQuery.value // Voeg zoekterm toe aan API call
  );
  choiceModules.value = modules;
  totalItems.value = total;
};

const fetchFilterOptions = async () => {
  try {
    const options = await api.getModuleFilterOptions();
    levels.value = options.levels;
    locations.value = options.locations;
    studyCredits.value = options.studycredits;
  } catch (error) {
    console.error("Kon filteropties niet laden:", error);
  }
};

onMounted(() => {
  fetchModules();
  fetchFilterOptions();
});

watch([selectedTags, selectedLevel, selectedLocation, selectedStudyCredits, searchQuery], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
  fetchModules();
}, { deep: true });

watch(currentPage, fetchModules);

const handleTagsUpdated = (tags: string[]) => {
  selectedTags.value = tags;
};

const onPageChange = (page: number) => {
  currentPage.value = page;
};

const { t } = useLocale(); // Gebruik de useLocale composable
</script>

<template>
  <div class="view-container modules-view">
    <h1>{{ t('modules') }}</h1>
    <div class="search-controls">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="t('searchPlaceholder')"
          class="search-input"
        />
      </div>
      <div class="modules-found-message">
        {{ totalItems }} {{ totalItems === 1 ? t('moduleFound') : t('modulesFound') }}
      </div>
    </div>
    <TagFilter @tags-updated="handleTagsUpdated" :currentStudent="true"/>

    <div class="filters">
      <div class="filter-item">
        <label for="level-filter">{{ t('levelFilter') }}</label>
        <select id="level-filter" v-model="selectedLevel">
          <option value="">{{ t('allLevels') }}</option>
          <option v-for="level in levels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label for="location-filter">{{ t('locationFilter') }}</label>
        <select id="location-filter" v-model="selectedLocation">
          <option value="">{{ t('allLocations') }}</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label for="credits-filter">{{ t('studyCreditsFilter') }}</label>
        <select id="credits-filter" v-model.number="selectedStudyCredits">
          <option :value="null">{{ t('allStudyCredits') }}</option>
          <option v-for="credit in studyCredits" :key="credit" :value="credit">
            {{ credit }}
          </option>
        </select>
      </div>
    </div>

    <PaginationControls
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="onPageChange" />

    <div class="module-grid">
      <ModuleCard
        v-for="module in choiceModules"
        :key="module._id"
        :module="module"
        @view-details="viewModuleDetails"
      />
    </div>

    <ModuleDetail
      v-if="selectedModule"
      :module="selectedModule"
      @close="closeModuleDetails"
    />

    <PaginationControls
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="onPageChange" />
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 1em;
  color: #000000; /* Donkergrijs voor tekst */
}

.filter-item select {
  -webkit-appearance: none; /* Verwijdert standaard styling in WebKit browsers */
  -moz-appearance: none; /* Verwijdert standaard styling in Firefox */
  appearance: none; /* Verwijdert standaard styling */

  padding: 10px 40px 10px 12px; /* Extra padding rechts voor het pijltje */
  border-radius: 8px;
  border: 1px solid #444; /* Donkergrijze rand */
  background-color: #f9f9f9; /* Heel lichte grijze achtergrond */
  color: #333;
  min-width: 200px;
  font-size: 1em;
  cursor: pointer;
  transition: border-color 0.2s ease;

  /* Achtergrond voor het pijltje */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23D32F2F' class='bi bi-caret-down-fill' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.filter-item select:hover {
  border-color: #D32F2F; /* Rode rand bij hover */
}

.filter-item select:focus {
  outline: none;
  border-color: #D32F2F; /* Rode rand bij focus */
}

.search-bar {
  margin-bottom: 0; /* Remove bottom margin as it's now in a flex container */
  flex-grow: 1; /* Allow search bar to take available space */
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #f9f9f9;
  color: #333;
  font-size: 1em;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #D32F2F;
}

.modules-found-message {
  text-align: right; /* Align text to the right within its container */
  margin: 0; /* Remove vertical margins */
  padding-left: 20px; /* Add some spacing from the search bar */
  white-space: nowrap; /* Prevent message from wrapping */
}

.search-controls {
  display: flex;
  align-items: center;
  gap: 20px; /* Space between search bar and message */
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}
</style>