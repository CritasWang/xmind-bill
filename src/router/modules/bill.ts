import { Layout } from '@/router/constant-routes';

const route = [
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/list',
    meta: { title: '记账本', icon: 'List', order: 10 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/bill/bill-list.vue'),
        meta: { title: '记账本', icon: 'List' },
      },
    ],
  },
];

export default route;
