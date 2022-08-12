<template>
  <div class="more-operation">
    <el-dropdown trigger="click">
      <el-button
        size="small"
        type="primary">
        <span>更多</span>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            icon="CircleClose"
            :disabled="currentDisabled"
            @click="closeCurrentTab">
            关闭当前标签
          </el-dropdown-item>
          <el-dropdown-item
            icon="Close"
            :disabled="tabsMenuList.length < 3"
            @click="closeOtherTab">
            关闭其他标签
          </el-dropdown-item>
          <el-dropdown-item
            icon="CloseBold"
            :disabled="tabsMenuList.length <= 1"
            @click="closeAllTab">
            关闭所有标签
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button
      size="small"
      text
      @click="switchFullscreen">
      <el-icon><FullScreen /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useAppStore from '@/store/modules/app';
import useTabsStore from '@/store/modules/tabs';
import { HOME_URL } from '@/config/app-config';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();
const tabStore = useTabsStore();

const { tabsMenuList } = storeToRefs(tabStore);

const currentDisabled = computed(() => tabStore.tabsMenuValue === HOME_URL);

// Close Current
const closeCurrentTab = () => {
  if (tabStore.tabsMenuValue === HOME_URL) return;
  tabStore.removeTabs(tabStore.tabsMenuValue);
};

// Close Other
const closeOtherTab = () => {
  tabStore.closeMultipleTab(tabStore.tabsMenuValue);
};

// Close All
const closeAllTab = () => {
  tabStore.closeMultipleTab();
  tabStore.goHome();
};

// 全屏
function switchFullscreen() {
  appStore.contentFullScreen = !appStore.contentFullScreen;
}
</script>
