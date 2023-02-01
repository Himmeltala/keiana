<script lang="ts" setup>
import { PropType } from "vue";
import { DataBase } from "@/database";

const props = defineProps({
  database: {
    type: Object as PropType<IDBDatabase>
  },
  data: {
    type: Object
  },
  value: {
    type: Object,
    required: true
  },
  currY: {
    type: String,
    required: true
  },
  currM: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const isShowDialog = ref(false);

async function confirmSubmit() {
  props.data.items[props.currM].items.splice(props.index, 1);
  await DataBase.put(props.database, Const.RECORD, Utils.Objects.raw(props.data), props.currY);
  isShowDialog.value = !isShowDialog.value;
}
</script>

<template>
  <div>
    <el-button size="small" text type="danger" @click="isShowDialog = !isShowDialog">删除收支</el-button>
    <el-dialog v-model="isShowDialog" append-to-body title="删除收支提示" width="90%">
      <el-form ref="formInst" hide-required-asterisk label-position="left" status-icon>
        <el-form-item label="备注" prop="text">
          {{ data.items[currM].items[index].text }}
        </el-form-item>
        <el-form-item label="金额" prop="cost">
          {{ data.items[currM].items[index].cost }}
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="data.items[currM].items[index].type">
            <el-radio v-for="i in ['支', '收']" :label="i" :value="i" disabled></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="连同" prop="sameat">
          <template v-for="i in data.items[currM].items[index].sameat">
            <el-checkbox v-if="i == currM" :label="i + '月'" :value="i" checked disabled />
            <el-checkbox v-else :label="i + '月'" :value="i" disabled />
          </template>
        </el-form-item>
        <el-form-item class="mt-10">
          <div class="f-c-c w-100%">
            <el-button class="mr-4" plain round type="danger" @click="confirmSubmit">
              <template #icon>
                <div class="i-tabler-trash"></div>
              </template>
            </el-button>
            <el-button plain round type="primary" @click="isShowDialog = !isShowDialog">
              <template #icon>
                <div class="i-tabler-x"></div>
              </template>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
