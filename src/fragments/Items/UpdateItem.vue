<script lang="ts" setup>
import { ChatDotRound, Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { DataBase } from "@/database";
import { PropType } from "vue";

const props = defineProps({
  database: {
    type: Object as PropType<IDBDatabase>
  },
  data: {
    type: Object,
    required: true
  },
  value: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  currM: {
    type: String,
    required: true
  },
  currY: {
    type: String,
    required: true
  }
});


const isShowDialog = ref(false);
const formInst = ref<FormInstance>();
const formRule = ref<FormRules>({
  cost: [{ validator: Utils.Forms.validateMoney, trigger: "change" }],
  text: [
    { required: true, message: "请输入收支备注", trigger: "blur" },
    { min: 1, max: 50, message: "长度在1~50个字符之间", trigger: "blur" }
  ]
});
const formData = ref<IItem>({
  ...props.value
});

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
  // props.data[props.currY][props.currM].items[props.index].cost = remark.cost;
}

function openUpdateDialog() {
  isShowDialog.value = !isShowDialog.value;
}

function confirmSubmit() {
  Utils.Forms.formValidator(
    formInst.value,
    async () => {
      props.data.items[props.currM].items[props.index] = formData.value;
      await DataBase.put(props.database, Const.RECORD, Utils.Objects.raw(props.data), props.currY);
      isShowDialog.value = !isShowDialog.value;
    },
    () => {
      ElMessage.error("检查输入的值是否正确");
    }
  );
}
</script>

<template>
  <div>
    <el-button size="small" text type="primary" @click="openUpdateDialog">编辑收支</el-button>
    <el-dialog v-model="isShowDialog" append-to-body title="修改支出项" width="90%">
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
            placeholder="请输入备注"
            @select="onAutocompleteSelected" />
        </el-form-item>
        <el-form-item label="花费" prop="cost">
          <el-input v-model.number="formData.cost" :prefix-icon="Coin" type="number" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="item in ['支', '收']" :value="item">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mt-10">
          <div class="f-c-c w-100%">
            <el-button class="mr-4" plain round @click="isShowDialog = !isShowDialog">
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
