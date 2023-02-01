<script lang="ts" setup>

const recordChartRef = shallowRef();

function init() {
}

onMounted(() => {
  init();
});
</script>

<template>
  <div>
    <div class="f-c-s">
      <div class="i-tabler-arrow-left" @click="$router.push('/')"></div>
    </div>
    <div class="my-5">
      <div>图表统计</div>
      <div class="text-0.8rem text-text-secondary">统计每月支出走势情况</div>
    </div>
    <div ref="recordChartRef" class="w-100% h-50vh"></div>
  </div>
</template>

<style lang="scss" scoped></style>
