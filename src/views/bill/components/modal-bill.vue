<template>
  <el-dialog
    v-model="visibleModel"
    width="700px"
    title="新增账单">
    <el-form
      ref="billFormRef"
      label-width="120px"
      :model="billForm"
      :rules="rules">
      <el-form-item
        label="账单类型"
        prop="type">
        <el-select
          v-model="billForm.type"
          placeholder="请选择账单类型"
          @change="()=> billForm.category = ''">
          <el-option
            label="支出"
            :value="0" />
          <el-option
            label="收入"
            :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="账单分类">
        <el-select
          v-model="billForm.category"
          placeholder="请选择账单分类">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="账单金额"
        prop="amount">
        <el-input-number
          v-model="billForm.amount"
          :min="-999999999"
          :max="999999999"
          :step="1"
          :controls-position="'right'"
          :controls="true"
          :precision="2" />
      </el-form-item>
      <el-form-item
        label="账单时间"
        prop="time">
        <el-date-picker
          v-model="billForm.time"
          type="datetime"
          placeholder="请选择账单时间" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visibleModel = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="onSubmit(billFormRef)">记账</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import BillApi from '@/api/bill.api';
import useRequest from '@/composition-api/base/useRequest';
import useCategoriesStore from '@/store/modules/categories';

const props = defineProps<{
  visible: boolean,
}>();

// eslint-disable-next-line no-spaced-func
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void,
  (e: 'add-success') : void,
}>();

const visibleModel = computed<boolean>({
  get() {
    return props.visible;
  },
  set(val: boolean) {
    emit('update:visible', val);
  },
});

const billFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  type: [
    { required: true, message: '请选择账单类型', trigger: 'blur' },
  ],
  amount: [
    { required: true, message: '请输入账单金额', trigger: 'change' },
  ],
  time: [
    { required: true, message: '请选择账单时间', trigger: 'change' },
  ],
});

const {
  requestFn: addBill,
  data: billForm,
  loading,
} = useRequest(BillApi.addBill, {
  initData: {
    type: 0,
    category: undefined,
    amount: 0.00,
    time: new Date().getTime(),
  } as Partial<Bill>,
});

const categoriesStore = useCategoriesStore();
categoriesStore.getAllCategories();

const categories = computed(() => categoriesStore.categories.filter(
  (category) => category.type === billForm.value.type,
));

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      const {
        type, category, amount, time,
      } = billForm.value;

      addBill({
        type, category, amount: (amount || 0) * 100, time,
      }).then(() => {
        visibleModel.value = false;
        emit('add-success');
      });
    }
  });
}
</script>
