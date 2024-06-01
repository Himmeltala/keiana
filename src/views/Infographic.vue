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

const calcTotalCost = (obj: any) => computed(() => {
  function recursiveSum(o: any): number {
    let total = 0;
    for (let key in o) {
      if (Array.isArray(o[key])) {
        total += o[key].reduce((sum: number, item: IBalance) => {
          return sum + (item.hasOwnProperty("cost") ? Number(item.cost) : 0);
        }, 0);
      } else if (typeof o[key] === "object" && o[key] !== null) {
        total += recursiveSum(o[key]);
      }
    }
    return total;
  }

  return recursiveSum(obj);
});

function countElemsLen(obj: any): number {
  function recursiveCount(o: any): number {
    let total = 0;
    for (let key in o) {
      if (Array.isArray(o[key])) {
        total += o[key].length;
      } else if (typeof o[key] === "object" && o[key] !== null) {
        total += recursiveCount(o[key]);
      }
    }
    return total;
  }

  return recursiveCount(obj);
}

const calcTotalBudget = (items: IRecord["items"]) => computed(() => {
  let total = 0;
  for (let key in items) {
    if (items.hasOwnProperty(key)) {
      total += Number(items[key].budget);
    }
  }
  return total;
});

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
    <div class="mb-4 f-c-b flex-wrap">
      <div class="flex-basis-33.33% max-w-33.33% mb-2">
        <div class="text-0.8rem">预算 ({{ Object.keys(data.items).length }})</div>
        <div class="text-gray">{{ calcTotalBudget(data.items) }}</div>
      </div>
      <div class="flex-basis-33.33% max-w-33.33%">
        <div class="text-0.8rem">支出 ({{ countElemsLen(grouped["支"] || []) }})</div>
        <div class="text-red">{{ calcTotalCost(grouped["支"] || []) }}</div>
      </div>
      <div class="flex-basis-33.33% max-w-33.33%">
        <div class="text-0.8rem">剩余</div>
        <div class="text-gray">
          {{
            (calcTotalBudget(data.items).value - calcTotalCost(grouped["支"] || []).value).toFixed(2)
          }}
        </div>
      </div>
    </div>
    <div v-for="(v, k) in grouped">
      <div v-if="k === '支'">
        <div>支出</div>
        <div class="mt-2 f-c-b flex-wrap">
          <div v-for="(v1, k1) in v" class="mb-2 flex-basis-50% max-w-50%">
            <el-statistic
              :precision="1"
              :title="k1 + ' (' + v1.length + ')'"
              :value="calcCost(v1)" />
          </div>
        </div>
      </div>
      <div v-if="k === '收'" class="mt-4">
        <div>收入</div>
        <div class="mt-2 f-c-b flex-wrap">
          <div v-for="(v1, k1) in v" class="mb-2 flex-basis-50% max-w-50%">
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
