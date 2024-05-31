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

function calcTotalCost(obj: any) {
  let total = 0;

  function recursiveSum(o: any) {
    for (let key in o) {
      if (Array.isArray(o[key])) {
        o[key].forEach((item: IBalance) => {
          if (item.hasOwnProperty("cost")) {
            total += Number(item.cost);
          }
        });
      } else if (typeof o[key] === "object" && o[key] !== null) {
        recursiveSum(o[key]);
      }
    }
  }

  recursiveSum(obj);
  return Utils.formatNumberWithUnits(total);
}

function countElemsLen(obj: any) {
  let total = 0;

  function recursiveCount(o: any) {
    for (let key in o) {
      if (Array.isArray(o[key])) {
        total += o[key].length;
      } else if (typeof o[key] === "object" && o[key] !== null) {
        recursiveCount(o[key]);
      }
    }
  }

  recursiveCount(obj);
  return total;
}

function calcTotalBudget(items: any) {
  let total = 0;
  for (let key in items) {
    if (items.hasOwnProperty(key)) {
      total += Number(items[key].budget);
    }
  }
  return Utils.formatNumberWithUnits(total);
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
    <div class="mb-4">
      <div>收支统计</div>
      <div class="text-0.8rem text-text-secondary">统计收支情况</div>
    </div>
    <div class="mb-4 f-c-b flex-nowrap">
      <div class="flex-basis-50% max-w-50%">
        <div class="text-0.8rem">预算 ({{ Object.keys(data.items).length }})</div>
        <div class="text-gray">{{ calcTotalBudget(data.items) }}</div>
      </div>
      <div class="flex-basis-50% max-w-50%">
        <div class="text-0.8rem">支出 ({{ countElemsLen(grouped["支"] || []) }})</div>
        <div class="text-red">{{ calcTotalCost(grouped["支"] || []) }}</div>
      </div>
      <div class="flex-basis-50% max-w-50%">
        <div class="text-0.8rem">收入 ({{ countElemsLen(grouped["收"] || []) }})</div>
        <div class="text-green">{{ calcTotalCost(grouped["收"] || []) }}</div>
      </div>
    </div>
    <div v-for="(v, k) in grouped">
      <div v-if="k === '支'">
        <div>支出</div>
        <div class="mt-2 f-c-b flex-wrap">
          <div v-for="(v1, k1) in v" class="mb-4 flex-basis-50% max-w-50%">
            <el-statistic
              :precision="2"
              :title="k1 + ' (' + v1.length + ')'"
              :value="calcCost(v1)" />
          </div>
        </div>
      </div>
      <div v-if="k === '收'" class="mt-4">
        <div>收入</div>
        <div class="mt-2 f-c-b flex-wrap">
          <div v-for="(v1, k1) in v" class="mb-4 flex-basis-50% max-w-50%">
            <el-statistic
              :precision="2"
              :title="k1 + ' (' + v1.length + ')'"
              :value="calcCost(v1)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
