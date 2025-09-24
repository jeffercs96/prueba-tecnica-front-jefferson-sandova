import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/roulette',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/game-page', component: () => import('pages/GamePage.vue') },
      { path: '/history-page', component: () => import('pages/HistoryPage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
