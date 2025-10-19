<script setup lang="ts">
import { useLocale } from '@/locale';

const { t } = useLocale();
</script>

<template>
  <main class="view-container">
    <h1>{{ t('homeWelcomeTitle') }}</h1>
    <p>{{ t('homeWelcomeText') }}</p>
  </main>
</template>

<style scoped>

</style> 