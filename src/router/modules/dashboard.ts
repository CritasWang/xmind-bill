import { Layout } from '@/router/constant-routes';

const route = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: 'dashboard', icon: 'HomeFilled', order: 0 },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/the-dashboard.vue'),
        meta: { title: '首页', icon: 'HomeFilled', hideClose: true },
      },
    ],
  },
];

export default route;
