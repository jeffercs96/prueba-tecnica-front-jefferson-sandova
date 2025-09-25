<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <q-card class="q-pa-md" style="width: 500px">
      <q-form @submit="onSubmit" class="row items-center justify-center q-gutter-sm">
        <div class="full-width text-center">Tu saldo actual es <strong>${{walletStore.balance}}</strong></div>
        <q-input
          dense
          outlined
          v-model.number="loadAmount"
          type="number"
          lazy-rules
          :rules="[(val) => val > 0 || 'Por favor ingresa el monto a cargar']"
          :min="1"
          hide-bottom-space
          hide-hint
          style="max-width: 150px"
        >
          <template v-slot:prepend>
            <q-icon name="attach_money" />
          </template>
        </q-input>
          <q-btn
            label="Cargar saldo"
            type="submit"
            color="positive"
            outline
            no-caps
            icon="wallet"
            class="full-height"
          />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useWalletStore } from 'stores/wallet';

const $q = useQuasar();
const walletStore = useWalletStore();
const loadAmount = ref<number>(1);

async function onSubmit() {
  try {
    $q.loading.show();
    await walletStore.updateWallet(walletStore.name, loadAmount.value);
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el saldo, por favor intenta de nuevo',
    });
  } finally {
    $q.loading.hide();
  }
}
</script>
