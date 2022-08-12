<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import useAppStore from '@/store/modules/app';

const locale = zhCn;
const appStore = useAppStore();

</script>

<template>
  <el-config-provider
    :locale="locale"
    :size="appStore.elementSize"
    :button="{autoInsertSpace: true}">
    <router-view />
  </el-config-provider>
</template>
