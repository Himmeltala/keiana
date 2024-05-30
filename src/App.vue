<script lang="ts" setup></script>

<template>
  <div class="p-4 bg-bg-page max-h-92vh overflow-auto">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </template>
    </RouterView>
  </div>
  <div class="min-h-8vh"></div>
</template>
