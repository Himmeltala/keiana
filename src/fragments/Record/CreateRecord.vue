<script lang="ts" setup>
import { PropType } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Coin } from "@element-plus/icons-vue";

const props = defineProps({
  database: {
    type: Object as PropType<IDBDatabase>
  },
  data: {
    type: Object,
    required: true
  },
  currM: {
    type: String,
    required: true
  },
  currY: {
    type: String,
    required: true
  },
  mList: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(["onCreated"]);

const dialog = ref(false);
const formData = ref({
  year: props.currY,
  month: "1月",
  budget: 5000
});
const formInst = ref<FormInstance>();
const formRule = ref<FormRules>();

function confirmSubmit() {
  Utils.Forms.formValidator(
    formInst.value,
    () => {
      const currM = formData.value.month.split("月")[0];
      const index = props.mList.findIndex(item => item == currM);

      if (index == -1) {
        props.data.items[currM] = { surplus: 0, budget: formData.value.budget, items: [] };
        Database.put(props.database, Const.RECORD, Utils.Objects.raw(props.data), props.currY).then(
          () => {
            dialog.value = !dialog.value;
            emits("onCreated");
          }
        );
      } else {
        ElMessage.error("已有该记录");
      }
    },
    () => ElMessage.error("创建记录失败")
  );
}

const keys = <{ value: string; label: string }[]>[];
for (let i = 0; i < 12; i++) {
  keys.push({ value: `${i + 1}`, label: `${i + 1}` });
}
</script>

<template>
  <div>
    <el-button size="small" text type="primary" @click="dialog = !dialog">创建记录</el-button>
    <el-dialog
      v-model="dialog"
      append-to-body
      title="创建记录"
      width="90%"
      @opened="formInst.resetFields()">
      <el-form
        ref="formInst"
        :model="formData"
        :rules="formRule"
        hide-required-asterisk
        label-position="left"
        status-icon>
        <el-form-item label="年份" prop="year">
          <el-date-picker
            v-model="formData.year"
            format="YYYY"
            placeholder="选择一个年份"
            style="width: 100%"
            type="year"
            value-format="YYYY" />
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-select v-model="formData.month" class="w-100%">
            <el-option
              v-for="item in keys"
              :key="item.value"
              :label="item.label + '月'"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算" prop="budget">
          <el-input v-model="formData.budget" :prefix-icon="Coin" type="number" />
        </el-form-item>
        <el-form-item class="mt-10">
          <div class="f-c-c w-100%">
            <el-button class="mr-4" plain round @click="dialog = !dialog">
              <template #icon>
                <div class="i-tabler-x"></div>
              </template>
            </el-button>
            <el-button plain round type="primary" @click="confirmSubmit">
              <template #icon>
                <div class="i-tabler-check"></div>
              </template>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
