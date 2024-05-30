<script setup lang="ts">
import type { UploadProps } from "element-plus";

const database = await Database.create();

async function exportJson() {
  const records = await Database.get<IRecord[]>(database, Const.RECORD);
  const comments = await Database.get(database, Const.COMMENTS, "0");
  const datetime = await Database.get(database, Const.VIEW_DATE, "0");

  const blob = new Blob([JSON.stringify([
    {
      records, comments, datetime
    }
  ])], { type: "text/json" });
  const a = document.createElement("a");
  const date = Utils.Dates.generateDate();
  a.download = `${date.y}-${date.m}-${date.d}${date.h}${date.minute}${date.second}.json`;
  a.href = URL.createObjectURL(blob);
  a.click();
}

const importJson: UploadProps["onChange"] = async file => {
  if (file.raw) {
    const reader = new FileReader();
    reader.readAsText(file.raw);
    reader.onload = () => {
      const result = JSON.parse(reader.result.toString());

      Database.clear(database, Const.RECORD).then(() => {
        result[0].records.forEach((i: any) => {
          Database.leadIn(database, i, Const.RECORD);
        });
      });
      Database.clear(database, Const.COMMENTS).then(() => {
        Database.leadIn(database, result[0].comments, Const.COMMENTS);
      });
      Database.clear(database, Const.VIEW_DATE).then(() => {
        Database.leadIn(database, result[0].datetime, Const.VIEW_DATE);
      });
    };
  }
};

async function delDatabase() {
  await Database.del(Const.TALLY_PAD);
}
</script>

<template>
  <div>
    <div class="mb-4">
      <div>设置</div>
      <div class="text-0.8rem text-text-secondary">一些设置和管理</div>
    </div>
    <div class="flex-wrap f-c-b">
      <div class="f-c-c flex-basis-33.33% max-w-33.33%">
        <el-button plain round type="primary" @click="exportJson">导出数据</el-button>
      </div>
      <el-upload class="f-c-c flex-basis-33.33% max-w-33.33%" accept="application/json" :auto-upload="false" :limit="1"
                 :on-change="importJson" :show-file-list="false">
        <el-button plain round type="success">导入数据</el-button>
      </el-upload>
      <div class="f-c-c flex-basis-33.33% max-w-33.33%">
        <el-popconfirm title="确定清除数据？" @confirm="delDatabase">
          <template #reference>
            <el-button plain round type="danger">清除数据</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>