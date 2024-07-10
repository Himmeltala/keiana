<script lang="ts" setup>
import { useEcharts } from "@/hooks/use-echarts";

const database = await Database.create();
const config = await Database.get<IConfig>(database, Const.DB_CONFIG, Const.DB_KEY_CONFIG);
const data = ref(await Database.get<IRecord>(database, Const.DB_RECORD, config.Y));

type GroupedVal = { [text: string]: IBalance[] }
type Grouped = { [name in "支" | "收"]?: GroupedVal }

function groupByType(data: any) {
  const grouped: Grouped = {};

  for (const key in data.items) {
    if (data.items.hasOwnProperty(key)) {
      const balances = data.items[key].balance;
      if (balances) {
        balances.forEach((balance: IBalance) => {
          const { type, text } = balance;
          grouped[type] = grouped[type] || {};
          grouped[type][text] = grouped[type][text] || [];
          grouped[type][text].push(balance);
        });
      }
    }
  }

  return grouped;
}

const calcTotalCost = (obj: GroupedVal) => {
  function recursiveSum(o: GroupedVal): number {
    return Object.values(o).reduce((total, value) => {
      if (Array.isArray(value)) {
        return total + value.reduce((sum: number, item: IBalance) => {
          return sum + (item.hasOwnProperty("cost") ? Number(item.cost) : 0);
        }, 0);
      } else if (typeof value === "object" && value !== null) {
        return total + recursiveSum(value);
      }
      return total;
    }, 0);
  }

  return recursiveSum(obj);
};

function calcSize(obj: GroupedVal): number {
  function recursiveCount(o: GroupedVal): number {
    return Object.values(o).reduce((total, value) => {
      if (Array.isArray(value)) {
        return total + value.length;
      } else if (typeof value === "object" && value !== null) {
        return total + recursiveCount(value);
      }
      return total;
    }, 0);
  }

  return recursiveCount(obj);
}

const calcTotalBudget = (items: IRecord["items"]) => {
  return Object.values(items).reduce((total, item) => total + Number(item.budget), 0);
};

const grouped = groupByType(data.value);

const calcCost = (balances: IBalance[]) => {
  return balances.reduce((total, item) => total + Number(item.cost), 0);
};

const calcTotalSurplus = (items: IRecord["items"]) => {
  return calcTotalBudget(items) - calcTotalCost(grouped["支"] || {}) + calcTotalCost(grouped["收"] || {});
};

const outcomeChart = ref(null);
const incomeChart = ref(null);

function formatData(data: any, max = 36) {
  return Object.entries(data).slice(0, max).map(([key, value]) => ({
    value: calcCost(value as any), name: key
  }));
}

onMounted(() => {
  if (!config.isChart) {
    return;
  }

  const createChart = (dom: any, data: any) => {
    useEcharts({
      dom,
      options: {
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#E5EAF3"
          }
        },
        series: [
          {
            label: {
              show: false
            },
            center: ["65%", "50%"],
            type: "pie",
            radius: "50%",
            data: formatData(data)
          }
        ]
      }
    });
  };

  if (grouped["支"]) {
    createChart(outcomeChart.value, grouped["支"]);
  }

  if (grouped["收"]) {
    createChart(incomeChart.value, grouped["收"]);
  }
});
</script>

<template>
  <div>
    <div class="mb-4">
      <div>收支统计</div>
      <div class="text-0.8rem text-text-secondary">统计 {{ config.Y }} 全年的收支情况</div>
    </div>
    <div class="mb-4 f-c-b flex-wrap">
      <div class="flex-basis-33.33% max-w-33.33%">
        <div class="text-0.8rem f-c-s">
          <div class="i-tabler-coin mr-1"></div>
          预算 ({{ Object.keys(data.items).length }})
        </div>
        <div class="text-gray text-0.8rem">{{ calcTotalBudget(data.items).toFixed(2) }}</div>
      </div>
      <div class="flex-basis-33.33% max-w-33.33%">
        <div class="text-0.8rem f-c-s">
          <div class="i-tabler-minus mr-1"></div>
          支出 ({{ calcSize(grouped["支"] || {}) }})
        </div>
        <div class="text-red text-0.8rem">{{ calcTotalCost(grouped["支"] || {}).toFixed(2) }}</div>
      </div>
      <div class="flex-basis-33.33% max-w-33.33%">
        <div class="text-0.8rem f-c-s">
          <div class="i-tabler-plus-minus mr-1"></div>
          剩余
        </div>
        <div class="text-gray text-0.8rem">
          {{
            calcTotalSurplus(data.items).toFixed(2)
          }}
        </div>
      </div>
    </div>
    <template v-if="grouped['支']">
      <div class="mb-4">
        <div>支出</div>
        <div class="text-0.8rem text-text-secondary">有 {{ Object.keys(grouped["支"]).length }} 类支出</div>
      </div>
      <div class="mb-2 f-c-b flex-wrap">
        <div v-for="(v, k) in grouped['支']" class="mb-2 flex-basis-50% max-w-50%">
          <div>
            <div class="text-0.8rem">{{ k + " (" + v.length + ")" }}</div>
            <div class="text-0.8rem">{{ calcCost(v).toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div ref="outcomeChart" style="width: 90vw; height: 50vh"></div>
    </template>
    <template v-if="grouped['收']">
      <div class="mb-4">
        <div>收入</div>
        <div class="text-0.8rem text-text-secondary">有 {{ Object.keys(grouped["收"]).length }} 类收入</div>
      </div>
      <div class="mb-2 f-c-b flex-wrap">
        <div v-for="(v, k) in grouped['收']" class="mb-2 flex-basis-50% max-w-50%">
          <div>
            <div class="text-0.8rem">{{ k + " (" + v.length + ")" }}</div>
            <div class="text-0.8rem">{{ calcCost(v).toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div ref="incomeChart" style="width: 90vw; height: 50vh"></div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
