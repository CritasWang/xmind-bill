<template>
  <el-container>
    <el-aside v-show="!contentFullScreen">
      <layout-menu />
    </el-aside>
    <el-container>
      <el-header>
        <layout-header v-show="!contentFullScreen" />
        <layout-tabs />
      </el-header>
      <el-main>
        <section class="main-box">
          <transition
            appear
            name="fade-transform"
            mode="out-in">
            <keep-alive :include="cacheRouter">
              <router-view />
            </keep-alive>
          </transition>
        </section>
      </el-main>
      <el-footer>
        <layout-footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import cacheRouter from '@/router/cacheRouter';
import useAppStore from '@/store/modules/app';
import { storeToRefs } from 'pinia';
import LayoutMenu from './layout-menu.vue';
import LayoutHeader from './layout-header.vue';
import LayoutTabs from './layout-tabs.vue';
import LayoutFooter from './layout-footer.vue';

const appStore = useAppStore();

const {
  contentFullScreen,
} = storeToRefs(appStore);

</script>

<style scoped lang="scss">
.el-container {
  display: flex;
  width: 100%;
  min-width: 960px;
  height: 100%;

  .el-aside {
    width: auto;
    overflow: inherit;
    background: #20222a;
  }

  .el-header,
  .el-footer {
    height: auto;
    padding: 0;
  }

  .el-main {
    box-sizing: border-box;
    padding: 10px 13px;

    // 防止切换出现横向滚动条
    overflow-x: hidden;
    background: var(--el-bg-color-page);

    .main-box {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 20px;
      overflow: auto;
      overflow-x: hidden !important;
      background-color: var(--el-bg-color);
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      &::-webkit-scrollbar {
        background-color: var(--el-bg-color);
      }
    }
  }
}
</style>
