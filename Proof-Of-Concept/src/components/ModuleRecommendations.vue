<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { IChoiceModule, ITag } from '../types';
import * as api from '../services/api';
import ModuleCard from './ModuleCard.vue';
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import ModuleDetail from '@/components/ModuleDetail.vue'; 


const selectedModule = ref<IChoiceModule | null>(null); 
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const props = defineProps({
  shortlistedModules: {
    type: Array as PropType<IChoiceModule[]>,
    required: true
  }
});

const recommendations = ref<IChoiceModule[]>([]);

type AnalyticsModule = Pick<IChoiceModule, '_id' | 'tags'>;
const allModulesForAnalytics = ref<AnalyticsModule[]>([]);

api.getAllModulesForAnalytics().then(modules => {
  allModulesForAnalytics.value = modules;
});

function viewModuleDetails(module: IChoiceModule) {
  selectedModule.value = module;
}

function closeModuleDetails() {
  selectedModule.value = null;
}

watch(
  [() => props.shortlistedModules, allModulesForAnalytics],
  async ([shortlisted, analyticsModules]) => {
    if (!shortlisted || shortlisted.length === 0 || !analyticsModules || analyticsModules.length === 0) {
      recommendations.value = [];
      return;
    }

    const tagCounts = new Map<string, number>();
    shortlisted.forEach(module => {
      if (module.tags) {
        module.tags.forEach(tag => {
          const tagId = typeof tag === 'string' ? tag : tag._id;
          tagCounts.set(tagId, (tagCounts.get(tagId) || 0) + 1);
        });
      }
    });

    const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);
    const topTags = sortedTags.slice(0, 3).map(entry => entry[0]);

    if (topTags.length === 0) {
      recommendations.value = [];
      return;
    }
    
    // 👇 HIER IS DE CORRECTIE 👇
    // We vertellen TypeScript hier om 'm' als 'any' te behandelen. Dit lost de type-fout op
    // omdat we zeker weten dat 'm._id' bestaat, ook al is de compiler in de war.
    const shortlistedIds = new Set(shortlisted.map((m: any) => m._id));

    const potentialRecommendations = analyticsModules.filter(
      (module) => !shortlistedIds.has(module._id)
    );

    const scoredRecommendations = potentialRecommendations.map(module => {
      let score = 0;
      if (module.tags) {
        module.tags.forEach(tag => {
          const tagId = typeof tag === 'string' ? tag : (tag as any)._id;
          if (topTags.includes(tagId)) {
            score++;
          }
        });
      }
      return { ...module, score };
    }).filter(module => module.score > 0);

    const topThreeRecs = scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    if (topThreeRecs.length > 0) {
      const idsToFetch = topThreeRecs.map((rec) => rec._id);
      try {
        const response = await api.getAllModules(1, 500, []); 
        const allFullModules: IChoiceModule[] = response.modules;
        
        const recommendationMap = new Map(allFullModules.map((m) => [m._id, m]));
        
        recommendations.value = idsToFetch
          .map(id => recommendationMap.get(id))
          .filter((m): m is IChoiceModule => !!m);

      } catch (error) {
        console.error("Fout bij het ophalen van de volledige modules:", error);
        recommendations.value = [];
      }
    } else {
      recommendations.value = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="recommendations.length > 0" class="recommendations-container">
    <h2>Aanbevolen Modules</h2>
    
      <ModuleCard
      v-for="module in recommendations"
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

</template>

<style scoped>
.recommendations-container {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

h2 {
  color: #FFFFFF;
  border-bottom: 2px solid #444;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}


</style>