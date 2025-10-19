<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import ModuleCard from '@/components/ModuleCard.vue';
import ModuleDetail from '@/components/ModuleDetail.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import type { IChoiceModule } from '@/types';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Paginering state
const currentPage = ref(1);
const itemsPerPage = 5; // Toon 5 favorieten per pagina

// Geselecteerde module voor detailweergave
const selectedModule = ref<IChoiceModule | null>(null);

// Haal de favorieten op voor de huidige pagina
const paginatedFavorites = computed(() => {
  if (!user.value) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return user.value.shortlisted_modules.slice(start, end);
});

const totalPages = computed(() => {
  if (!user.value) {
    return 1;
  }
  return Math.ceil(user.value.shortlisted_modules.length / itemsPerPage);
});

function onPageChange(page: number) {
  currentPage.value = page;
}

function viewModuleDetails(module: IChoiceModule) {
  selectedModule.value = module;
}

function closeModuleDetails() {
  selectedModule.value = null;
}
</script>

<template>
  <div class="view-container favorites-view">
    <h1>Mijn Favorieten</h1>
    <div v-if="user && user.shortlisted_modules.length > 0" class="favorites-list">
      <ModuleCard
        v-for="module in paginatedFavorites"
        :key="module._id"
        :module="module"
        @view-details="viewModuleDetails"
      />
      <PaginationControls
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="onPageChange"
      />
    </div>
    <div v-else class="no-favorites">
      <p>Je hebt nog geen modules aan je favorieten toegevoegd.</p>
    </div>
  </div>

  <ModuleDetail 
    v-if="selectedModule" 
    :module="selectedModule" 
    @close="closeModuleDetails" 
  />
</template>

<style scoped>
/* Specifieke layout voor de favorietenlijst kan hier blijven */
.favorites-list {
  display: grid;
  gap: 1.5rem;
}

.no-favorites {
  text-align: center;
  margin-top: 4rem;
  color: var(--color-text-soft);
}
</style>