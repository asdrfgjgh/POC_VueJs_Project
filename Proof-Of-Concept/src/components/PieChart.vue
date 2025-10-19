<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import type { PropType } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

defineProps({
  chartData: {
    type: Object as PropType<{
      labels: string[];
      datasets: {
        backgroundColor: string[];
        data: number[];
      }[];
    }>,
    required: true,
  },
});

// Aangepaste chartOptions om de legenda te verbergen
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Deze regel verbergt de legenda
    },
    tooltip: {
      // Stijlen voor de tooltip (wanneer je hovert) blijven behouden
      titleColor: '#FFFFFF',
      bodyColor: '#E0E0E0',
      bodyFont: {
        size: 13
      },
      titleFont: {
        size: 14,
        weight: 'bold' as const
      }
    }
  }
};
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>