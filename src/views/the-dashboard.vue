<template>
  <el-form inline>
    <el-form-item label="账单月份">
      <el-date-picker
        v-model="searchOptions.startTime"
        type="month"
        placeholder="选择月份"
        @change="reloadData" />
    </el-form-item>
  </el-form>
  <el-row
    v-loading="statisticsLoading"
    style="height: calc(100% - 100px);"
    :gutter="20">
    <el-col
      id="statistics-container"
      :span="8" />
    <el-col
      id="income-container"
      :span="8" />
    <el-col
      id="pay-container"
      :span="8" />
  </el-row>
</template>
<script setup lang="ts">
import BillApi from '@/api/bill.api';
import {
  reactive, unref, onMounted,
} from 'vue';
import { date2Timestamp, addMonth } from '@/utils/date';
import useRequest from '@/composition-api/base/useRequest';
import useFormat from '@/composition-api/business/useFormat';
import { echarts, type ECOption } from '@/plugins/echartsPlugin';
import { cent2Yuan } from '@/utils';

const { formatCategory } = useFormat();

const searchOptions = reactive({
  startTime: new Date(2019, 11, 1),
});

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
const {
  data: statistics,
  loading: statisticsLoading,
  requestFn: fetchStatistics,
} = useRequest(BillApi.statistics, {
  initData: {
    incomeTotalAmount: 0, payTotalAmount: 0, incomeBills: [], payBills: [],
  } as BillStatistics,
});
let statisticsChart: echarts.ECharts;
let incomeChart: echarts.ECharts;
let payChart: echarts.ECharts;

function buildStatisticsChartOption() {
  return {
    title: {
      text: '收入与支出',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: number) => `￥${value.toFixed(2)}`,
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '收入与支出',
        type: 'pie',
        radius: '50%',
        data: [
          { value: cent2Yuan(statistics.value.incomeTotalAmount), name: '合计收入' },
          { value: cent2Yuan(statistics.value.payTotalAmount), name: '累计支出' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
}

function buildBarOption(title:string, data: Bill[]) {
  return {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: number) => `￥${value.toFixed(2)}`,
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    xAxis: {
      type: 'category',
      name: '账单分类',
      data: [...data.map((item) => formatCategory(item.category))],
    },
    yAxis: {
      type: 'value',
      name: '合计金额',
      axisLabel: {
        formatter: '￥{value} 元',
      },
    },
    series: [
      {
        data: [...data.map((item) => cent2Yuan(item.amount))],
        type: 'bar',
      },
    ],
  };
}

function buildIncomeChartOption() {
  return buildBarOption('收入统计', statistics.value.incomeBills);
}

function buildPayChartOption() {
  return buildBarOption('支出统计', statistics.value.payBills);
}

function reloadData() {
  fetchStatistics(buildStatisticsParams()).then(() => {
    statisticsChart.setOption(buildStatisticsChartOption());
    console.log(buildIncomeChartOption());
    incomeChart.setOption(buildIncomeChartOption());
    payChart.setOption(buildPayChartOption());
  });
}

onMounted(() => {
  const statisticsContainer = document.getElementById('statistics-container');
  const incomeContainer = document.getElementById('income-container');
  const payContainer = document.getElementById('pay-container');
  reloadData();
  if (statisticsContainer) {
    statisticsChart = echarts.init(statisticsContainer);
  }
  if (incomeContainer) {
    incomeChart = echarts.init(incomeContainer);
  }
  if (payContainer) {
    payChart = echarts.init(payContainer);
  }
});

</script>
