<template>
  <div class="error-container">
    <!-- <img src="@/assets/images/500.png" class="error-img" alt="500" /> -->
    <div class="error-detail">
      <h2>500</h2>
      <h4>抱歉，您的网络不见了~🤦‍♂️🤦‍♀️</h4>
      <el-button
        type="primary"
        @click="tabStore.goHome()">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useTabsStore from '@/store/modules/tabs';

const tabStore = useTabsStore();
</script>

<style scoped lang="scss">
@import "./error.scss";
</style>
