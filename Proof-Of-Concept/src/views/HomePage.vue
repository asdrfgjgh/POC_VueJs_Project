<script setup lang="ts">
import { useLocale } from '@/locale';

const { t } = useLocale();
</script>

<template>
  <main class="view-container">
    <h1>{{ t('homeWelcomeTitle') }}</h1>
    <p>{{ t('homeWelcomeText') }}</p>
    <p>{{ t('homeParagraph1') }}</p>
    <p>{{ t('homeParagraph2') }}</p>
    <p>{{ t('homeParagraph3') }}</p>
  </main>
</template>

<style scoped>

</style> 