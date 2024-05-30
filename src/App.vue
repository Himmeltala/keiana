<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="px-4 pt-4 bg-bg-page min-h-92vh overflow-auto pb-10vh">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </template>
    </RouterView>
  </div>
  <div class="min-h-8vh bg-bg-overlay f-c-b px-4 fixed left-0 bottom-0 w-100%">
    <div class="w-4rem" :class="{ 'text-current': route.name === '首页' }" @click="$router.push('/')">
      <div class="f-c-c text-1.2rem">
        <div class="i-tabler-home"></div>
      </div>
      <div class="text-center text-0.6rem">首页</div>
    </div>
    <div class="w-4rem" :class="{ 'text-current': route.name === '备注' }" @click="$router.push('/comments')">
      <div class="f-c-c text-1.2rem">
        <div class=" i-tabler-bookmark"></div>
      </div>
      <div class="text-center text-0.6rem">备注</div>
    </div>
    <div class="w-4rem" :class="{ 'text-current': route.name === '统计' }" @click="$router.push('/infographic')">
      <div class="f-c-c text-1.2rem">
        <div class="i-tabler-chart-infographic"></div>
      </div>
      <div class="text-center text-0.6rem">统计</div>
    </div>
  </div>
</template>

<style scoped>
.text-current {
  color: #3498db; /* Replace with your desired color */
}
</style>
