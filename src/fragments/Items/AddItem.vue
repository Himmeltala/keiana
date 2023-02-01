<script lang="ts" setup>
import { PropType } from "vue";
import { ChatDotRound, Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { DataBase } from "@/database";

const props = defineProps({
  database: {
    type: Object as PropType<IDBDatabase>
  },
  data: {
    type: Object as PropType<IRecord>
  },
  currY: {
    type: String,
    required: true
  },
  currM: {
    type: String,
    required: true
  }
});

const dialog = ref(false);
const formData = ref<IItem>({
  cost: 100,
  text: "",
  type: "支",
  sameat: []
});
const formInst = ref<FormInstance>();
const formRule = ref<FormRules>({
  cost: [{ validator: Utils.Forms.validateMoney, trigger: "change" }],
  text: [
    { required: true, message: "请输入收支备注", trigger: "blur" },
    { min: 1, max: 50, message: "长度在1~50个字符之间", trigger: "blur" }
  ]
});

function confirmSubmit() {
  Utils.Forms.formValidator(
    formInst.value,
    async () => {
      props.data.items[props.currM].items.push(formData.value);
      await DataBase.put(props.database, Const.RECORD, Utils.Objects.raw(props.data), props.currY);
      dialog.value = !dialog.value;
      ElMessage.success("添加收支项成功");
    },
    () => {
      ElMessage.error("检查输入的值是否正确");
    }
  );
}

const findFromComments = (target: any, callback: any) => {
  // const remark = target
  //   ? storage.value.comments.filter(createFilter(target))
  //   : storage.value.comments;
  // callback(remark);
};

const createFilter = (target: any) => {
  return (source: any) => {
    return source.value.includes(target);
  };
};

function onAutocompleteSelected(remark: IComments) {
  formData.value.text = remark.value;
  formData.value.cost = remark.cost;
  formData.value.type = remark.type;
}

function afterOpenedDialog() {
  formInst.value.resetFields();
  formData.value.sameat = [props.currM];
}
</script>

<template>
  <div>
    <el-button size="small" text type="success" @click="dialog = !dialog">添加收支</el-button>
    <el-dialog
      v-model="dialog"
      append-to-body
      title="添加收支"
      width="90%"
      @opened="afterOpenedDialog">
      <el-form
        ref="formInst"
        :model="formData"
        :rules="formRule"
        hide-required-asterisk
        label-position="left"
        status-icon>
        <el-form-item label="备注" prop="text">
          <el-autocomplete
            v-model="formData.text"
            :fetch-suggestions="findFromComments"
            :prefix-icon="ChatDotRound"
            class="w-100%"
            placeholder="请输入收支备注"
            @select="onAutocompleteSelected" />
        </el-form-item>
        <el-form-item label="花费" prop="cost">
          <el-input
            v-model="formData.cost"
            :prefix-icon="Coin"
            placeholder="请输入收支金额"
            type="number" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="item in ['支', '收']" :label="item" :value="item"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="连同" prop="sameat">
          <el-checkbox-group v-model="formData.sameat">
            <template v-for="i in Object.keys(data.items)" v-if="data?.items">
              <el-checkbox v-if="i === currM" :label="i + '月'" :value="i" checked disabled />
              <el-checkbox v-else :label="i + '月'" :value="i" />
            </template>
          </el-checkbox-group>
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
