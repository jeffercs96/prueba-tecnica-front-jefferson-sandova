import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('pages/IndexPage.vue'),
    meta: { guestOnly: true }
  },

  {
    path: '/roulette',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'game-page', name: 'game', component: () => import('pages/GamePage.vue') },
      { path: 'load-credit-page', name: 'load-credit', component: () => import('pages/LoadCreditPage.vue') },
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
