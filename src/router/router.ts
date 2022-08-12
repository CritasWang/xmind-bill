import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { HOME_URL } from '@/config/app-config';
import { registerGuard as registerAuthGuard } from './guard/auth-guard';

const metaRouters = import.meta.glob('./modules/*.ts', { eager: true }) as Record<string, Array<RouteRecordRaw>>;

export const asyncRoutes: Array<RouteRecordRaw> = [];
Object.keys(metaRouters).forEach((item) => {
  Object.keys(metaRouters[item]).forEach((key: any) => {
    asyncRoutes.push(...metaRouters[item][key]);
  });
});

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: HOME_URL,
  },
  {
    // 找不到路由重定向到404页面
    path: '/:pathMatch(.*)',
    redirect: { name: '404' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function addRoutes() {
  asyncRoutes.forEach((item) => {
    routes.push(item);
    router.addRoute(item);
  });
}

registerAuthGuard(router);

addRoutes();

export default router;
