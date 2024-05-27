<script lang="ts" setup>
import type { UploadProps } from "element-plus";

function exportJson() {
  // const blob = new Blob([JSON.stringify(getStorage().value)], { type: "text/json" });
  // const a = document.createElement("a");
  // const date = Utils.Dates.generateDate();
  // a.download = `${date.y}-${date.m}-${date.d}${date.h}${date.minute}${date.second}.json`;
  // a.href = URL.createObjectURL(blob);
  // a.click();
}

const importJson: UploadProps["onChange"] = async file => {
  if (file.raw) {
    const reader = new FileReader();
    reader.readAsText(file.raw);
    reader.onload = () => {
      const result = JSON.parse(reader.result.toString());
    };
  }
};

function delDatabase() {
  Database.del(Const.TALLY_PAD);
}
</script>

<template>
  <div class="mb-5">
    <div class="text-1.2rem mb-5">数据管理</div>
    <div class="mb-5">
      <el-button plain round type="primary" @click="exportJson">导出数据</el-button>
    </div>
    <el-upload :auto-upload="false" :limit="1" :on-change="importJson" class="mb-5">
      <el-button plain round type="success">导入数据</el-button>
    </el-upload>
    <div class="mb-5">
      <el-button plain round type="warning" @click="$router.push('/comments')">管理备注</el-button>
    </div>
    <div>
      <el-button plain round type="danger" @click="delDatabase">清除数据</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
