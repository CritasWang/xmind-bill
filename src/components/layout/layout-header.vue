<template>
  <div class="header">
    <div class="header-lf flex-center">
      <el-icon
        class="collapse-icon"
        @click="menuStore.setCollapse()">
        <component :is="isCollapse ? 'expand' : 'fold'" />
      </el-icon>
      <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group
          name="breadcrumb"
          mode="out-in">
          <el-breadcrumb-item
            :key="HOME_URL"
            :to="{ path: HOME_URL }">
            首页
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="item in matched"
            :key="item.path"
            :to="{ path: item.path }">
            {{ item.meta.title }}
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <div class="header-ri flex-center">
      <el-switch
        v-model="isDark"
        class="switch-dark"
        inline-prompt
        active-icon="Moon"
        inactive-icon="Sunny" />
      <user-header />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDark } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import useMenuStore from '@/store/modules/menu';
import { HOME_URL } from '@/config/app-config';
import UserHeader from './components/layout-header-user.vue';

const route = useRoute();

const matched = computed(() => route.matched.filter((item) => item.meta && item.meta.title && item.meta.title !== '首页'));
const menuStore = useMenuStore();
const isCollapse = computed((): boolean => menuStore.isCollapse);
const isDark = useDark();
</script>

<style scoped lang="scss">
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
  padding: 0 15px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-extra-light);

  .header-lf {
    .collapse-icon {
      margin-right: 20px;
      font-size: 22px;
      cursor: pointer;
    }
  }

  .header-ri {
    margin: 0 30px;

    .switch-dark {
      margin: 0 22px 0 0;
    }
  }
}
</style>
