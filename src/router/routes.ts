import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('pages/IndexPage.vue'),
  },

  {
    path: '/roulette',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'game-page', name: 'game', component: () => import('pages/GamePage.vue') },
      { path: 'history-page', name: 'history', component: () => import('pages/HistoryPage.vue') },
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
