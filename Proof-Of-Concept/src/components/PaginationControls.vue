<script setup lang="ts">
import { useLocale } from '@/locale';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>();

const { t } = useLocale();

function goToPage(page: number) {
  if (page > 0 && page <= props.totalPages) {
    // 👇 CORRECTIE: De event naam is nu in camelCase
    emit('pageChange', page);
  }
}
</script>

<template>
  <div class="pagination-controls" v-if="totalPages > 1">
    <button @click="goToPage(1)" :disabled="currentPage === 1">
      {{ t('paginationFirst') }}
    </button>
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
      {{ t('paginationPrevious') }}
    </button>

        <span class="page-info">
      {{ t('paginationPage') }} {{ currentPage }} {{ t('paginationOf') }} {{ totalPages }}
    </span>

    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
      {{ t('paginationNext') }}
    </button>
    <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">
      {{ t('paginationLast') }}
    </button>
  </div>
</template>

<style scoped>

.page-info {
  color: #E0E0E0; /* Lichte kleur voor betere leesbaarheid op donkere achtergrond */
  font-weight: 500;
  margin: 0 1rem;
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 10px;
}

.pagination-controls button {
  padding: 8px 16px;
  border: 1px solid #8B0000; /* Donkerrood */
  background-color: #fff;
  color: #8B0000; /* Donkerrood */
  cursor: pointer;
  border-radius: 20px; /* Rondere knoppen */
  transition: background-color 0.2s, color 0.2s;
  font-weight: bold;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #A52A2A; /* Iets lichtere rood voor hover */
  color: #fff;
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  border-color: #aaa;
  color: #aaa;
}
</style>