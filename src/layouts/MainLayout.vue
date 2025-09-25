<template>
  <div>
    <q-layout view="lHh Lpr lff" container style="height: 100vh">
      <q-header elevated class="bg-cyan-8">
        <q-toolbar>
          <q-toolbar-title>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            RouletteGame
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400">
        <q-scroll-area
          style="height: calc(100% - 200px); margin-top: 200px; border-right: 1px solid #ddd"
        >
          <q-list padding>
            <q-item :to="{name: 'game'}" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="casino" />
              </q-item-section>

              <q-item-section> Juego de la ruleta</q-item-section>
            </q-item>
            <q-item :to="{name: 'load-credit'}" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="account_balance_wallet" />
              </q-item-section>

              <q-item-section>Cargar Saldo</q-item-section>
            </q-item>
            <q-item active clickable v-ripple active-class="text-negative" @click="logout">
              <q-item-section avatar>
                <q-icon name="exit_to_app" />
              </q-item-section>

              <q-item-section> Salir</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 200px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="avatar"/>
            </q-avatar>
            <div class="text-weight-bold text-h5">Hola {{ walletStore.name }}</div>
            <div class="text-weight-bold">balance:</div>
            <div class="text-weight-bold text-h4">${{ walletStore.balance }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWalletStore } from 'stores/wallet';
import { useRouter } from 'vue-router';
import { useHistoryStore } from 'stores/history';

const walletStore = useWalletStore();
const historyStore = useHistoryStore();
const drawer = ref(false);
const router = useRouter();

async function logout() {
  walletStore.logout();
  await router.push({name: 'home'});
  historyStore.clearHistory();
}
</script>
