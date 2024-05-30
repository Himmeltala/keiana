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
  return total;
}

function countElemsLen(obj: any) {
  let totalCount = 0;

  function recursiveCount(o: any) {
    for (let key in o) {
      if (Array.isArray(o[key])) {
        totalCount += o[key].length;
      } else if (typeof o[key] === "object" && o[key] !== null) {
        recursiveCount(o[key]);
      }
    }
  }

  recursiveCount(obj);
  return totalCount;
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
    <div class="mb-2">
      <div>收支统计</div>
      <div class="text-0.8rem text-text-secondary">统计相同收支总金额</div>
    </div>
    <div class="mb-4 f-c-b flex-nowrap">
      <div class="flex-basis-50% max-w-50%">
        <div class="text-0.8rem">总支出 ({{ countElemsLen(grouped["支"] || []) }})</div>
        <div class="text-red">{{ calcTotalCost(grouped["支"] || []) }}</div>
      </div>
      <div class="flex-basis-50% max-w-50%">
        <div class="text-0.8rem">总收入 ({{ countElemsLen(grouped["收"] || []) }})</div>
        <div class="text-green">{{ calcTotalCost(grouped["收"] || []) }}</div>
      </div>
    </div>
    <div v-for="(v, k) in grouped">
      <template v-if="k === '支'">
        <el-card>
          <div>
            <div>支出统计</div>
            <div class="text-0.8rem text-text-secondary">相同类型的支出总数和总额</div>
          </div>
          <div class="mt-2 f-c-b flex-wrap">
            <div v-for="(v1, k1) in v" class="mb-4 flex-basis-50% max-w-50%">
              <el-statistic
                :precision="2"
                :title="k1 + ' (' + v1.length + ')'"
                :value="calcCost(v1)" />
            </div>
          </div>
        </el-card>
      </template>
      <template v-if="k === '收'">
        <el-card class="mt-4">
          <div>
            <div>收入统计</div>
            <div class="text-0.8rem text-text-secondary">相同类型的收入总数和总额</div>
          </div>
          <div class="mt-2 f-c-b flex-wrap">
            <div v-for="(v1, k1) in v" class="mb-4 flex-basis-50% max-w-50%">
              <el-statistic
                :precision="2"
                :title="k1 + ' (' + v1.length + ')'"
                :value="calcCost(v1)" />
            </div>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
