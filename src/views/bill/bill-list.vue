<template>
  <el-form inline>
    <el-form-item label="账单月份">
      <el-date-picker
        v-model="searchOptions.startTime"
        type="month"
        placeholder="选择月份"
        @change="reloadData" />
    </el-form-item>
    <el-form-item label="账单分类">
      <el-select
        v-model="searchOptions.category"
        clearable
        placeholder="请选择账单分类"
        @change="fetchList(1)">
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id" />
      </el-select>
    </el-form-item>
    <el-button
      type="primary"
      class="right"
      @click="onAdd()">
      记账
    </el-button>
  </el-form>
  <div
    v-if="!searchOptions.startTime"
    v-loading="statisticsLoading"
    class="p-y-10"
    style="text-align: right;">
    <span>合计收入</span>
    <span style="color: var(--el-color-primary);">
      ￥{{ cent2Yuan(statistics.incomeTotalAmount) }}
    </span>
    <span class="m-l-10">累计支出</span>
    <span style="color: var(--el-color-danger);">
      ￥{{ cent2Yuan(statistics.payTotalAmount) }}
    </span>
  </div>
  <el-row
    v-if="searchOptions.startTime"
    :gutter="20">
    <el-col :span="12">
      <el-card>
        <template #header>
          <span>合计收入</span>
          <span style="color: var(--el-color-primary);">
            ￥{{ cent2Yuan(statistics.incomeTotalAmount) }}
          </span>
        </template>
        <el-table
          :data="statistics.incomeBills"
          height="200px"
          max-height="200">
          <el-table-column
            v-slot="{row}"
            prop="category"
            label="账单分类">
            {{ formatCategory(row.category) }}
          </el-table-column>
          <el-table-column
            v-slot="{row}"
            prop="amount"
            label="合计金额">
            ￥{{ cent2Yuan(row.amount) }}
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <template #header>
          <span>累计支出</span>
          <span style="color: var(--el-color-danger);">
            ￥{{ cent2Yuan(statistics.payTotalAmount) }}
          </span>
        </template>
        <el-table
          :data="statistics.payBills"
          height="200px"
          max-height="200">
          <el-table-column
            v-slot="{row}"
            prop="category"
            label="账单分类">
            {{ formatCategory(row.category) }}
          </el-table-column>
          <el-table-column
            v-slot="{row}"
            prop="amount"
            label="合计金额">
            ￥{{ cent2Yuan(row.amount) }}
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
  <el-card
    header="账单详情"
    class="m-t-20">
    <el-table
      v-loading="loading"
      :max-height="maxTableHeight"
      :data="tabelData">
      <el-table-column
        v-slot="{row}"
        prop="time"
        label="账单时间">
        {{ formatDate(row?.time, 'yyyy-MM-dd HH:mm:ss') }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="type"
        label="账单类型">
        {{ formatType(row.type) }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="category"
        label="账单分类">
        {{ formatCategory(row.category) }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="amount"
        label="账单金额">
        ￥{{ cent2Yuan(row.amount) }}
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="m-t-20"
      background
      :page-sizes="[5, 10, 20, 50]"
      layout="sizes, prev, pager, next, total"
      :total="pagination.total"
      @size-change="onChangePageSize"
      @current-change="onChangePage" />
  </el-card>

  <model-bill
    v-if="addVisible"
    v-model:visible="addVisible"
    @add-success="reloadData" />
</template>
<script setup lang="ts">
import BillApi from '@/api/bill.api';
import { reactive, unref, computed } from 'vue';
import { date2Timestamp, formatDate, addMonth } from '@/utils/date';
import { cent2Yuan } from '@/utils';
import useRequest from '@/composition-api/base/useRequest';
import useTable from '@/composition-api/base/useTable';
import useFormat from '@/composition-api/business/useFormat';
import useTableHeight from '@/composition-api/base/useTableHeight';
import useToggleBool from '@/composition-api/base/useToggleBool';
import useCategoriesStore from '@/store/modules/categories';
import ModelBill from './components/modal-bill.vue';

const { formatCategory, formatType } = useFormat();
const { maxTableHeight } = useTableHeight(500, 220);

const { bool: addVisible, toggle: onAdd } = useToggleBool(
  false,
);

const searchOptions = reactive({
  type: undefined,
  startTime: new Date(2019, 11, 1),
  endTime: undefined,
  category: undefined,
});

const categoriesStore = useCategoriesStore();

categoriesStore.getAllCategories();

const categories = computed(() => categoriesStore.categories);

function buildStatisticsParams():BillQO {
  const {
    startTime,
  } = unref(searchOptions);

  let endTime;
  if (startTime) {
    endTime = addMonth(startTime, 1);
  }

  return {
    startTime: startTime ? date2Timestamp(startTime) : '',
    endTime: endTime ? date2Timestamp(endTime) : '',
  } as BillQO;
}

function buildParams(
  page: number,
  size: number,
): [Partial<BillQO & PageQuery>] {
  const {
    startTime,
    ...other
  } = unref(searchOptions);

  let endTime;
  if (startTime) {
    endTime = addMonth(startTime, 1);
  }

  return [
    {
      ...other,
      startTime: startTime ? date2Timestamp(startTime) : '',
      endTime: endTime ? date2Timestamp(endTime) : '',
      size,
      page: page - 1,
    },
  ] as [Partial<BillQO & PageQuery>];
}

const {
  list: tabelData,
  pagination,
  loading,
  fetchList,
  onChangePage,
  onChangePageSize,
} = useTable(BillApi.queryBills, {
  buildParams,
});

const {
  data: statistics,
  loading: statisticsLoading,
  requestFn: fetchStatistics,
} = useRequest(BillApi.statistics, {
  initData: {
    incomeTotalAmount: 0, payTotalAmount: 0, incomeBills: [], payBills: [],
  } as BillStatistics,
});

function reloadData() {
  fetchList(1);
  fetchStatistics(buildStatisticsParams());
}

fetchList();
fetchStatistics(buildStatisticsParams());

</script>
