<script lang="ts" setup>
const database = await Database.create();
const datetime = await Database.get<ViewDate>(database, Const.VIEW_DATE, "0");
const data = ref(await Database.get<IRecord>(database, Const.RECORD, datetime.Y));

function group(data: any) {
  const grouped: { [type: string]: { [text: string]: any[] } } = {};

  for (const key in data.items) {
    if (data.items.hasOwnProperty(key)) {
      const item = data.items[key];
      if (item.balance) {
        item.balance.forEach((entry: any) => {
          const { type, text } = entry;
          if (!grouped[type]) {
            grouped[type] = {};
          }
          if (!grouped[type][text]) {
            grouped[type][text] = [];
          }
          grouped[type][text].push(entry);
        });
      }
    }
  }

  return grouped;
}

const grouped = group(data.value);

function calcCost(balances: IBalance[]) {
  if (!balances.length) return 0;
  let total = 0;
  balances.forEach(i => (total += Number(i.cost)));
  return total;
}
</script>

<template>
  <div>
    <div class="mb-5">
      <div>收支统计</div>
      <div class="text-0.8rem text-text-secondary">统计相同收支总金额</div>
    </div>
    <div v-for="(v, k) in grouped">
      <template v-if="k === '支'">
        <el-tag type="danger">支出统计</el-tag>
        <div class="mt-4 f-c-b flex-wrap">
          <div v-for="(v1, k1) in v" class="mb-4 flex-basis-33.33% max-w-33.33%">
            <el-statistic :title="k1 + ' (' + v1.length + ')'" :value="calcCost(v1)" />
          </div>
        </div>
      </template>
      <template v-else>
        <el-tag type="success">收入统计</el-tag>
        <div class="mt-4 f-c-b flex-wrap">
          <div v-for="(v1, k1) in v" class="mb-4 flex-basis-33.33% max-w-33.33%">
            <el-statistic :title="k1 + ' (' + v1.length + ')'" :value="calcCost(v1)" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>