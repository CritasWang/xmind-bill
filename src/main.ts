import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/router';
import { iconPlugin } from '@/plugins/iconPlugin';
import pinia from './store';

import '@/styles/main.scss';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(iconPlugin);
router.isReady().then(() => {
  // 等待路由准备就绪可防止某些竞态情况
  app.mount('#app');
});
