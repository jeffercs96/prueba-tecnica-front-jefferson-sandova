<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <p class="text-h4 text-primary text-weight-bold text-center">REGISTRO</p>
        <p>Por favor ingresa tu nombre de usuario:</p>
        <q-input
          filled
          v-model="name"
          label="Nombre de Usuario"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Por favor ingresa tu nombre de usuario']"
        />
        <q-input
          filled
          v-model.number="balance"
          label="Registra tu balance inicial"
          lazy-rules
          :rules="[(val) => val > 0 || 'tu balance no puede ser menor o igual a 0']"
          type="number"
        />
        <div>
          <q-btn
            class="full-width"
            label="Guardar y continuar"
            type="submit"
            color="primary"
            outline
            no-caps
          />
          <q-btn
            class="full-width q-mt-sm"
            label="Cancelar"
            color="negative"
            flat
            no-caps
            @click="onDialogHide"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { ref } from 'vue';
import { useWalletStore } from 'stores/wallet';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref<string>('');
const balance = ref<number>(0);
const walletStore = useWalletStore();
const $q = useQuasar();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();

async function onSubmit() {
  try {
    $q.loading.show();
    await walletStore.saveWallet(name.value, balance.value);
    await router.push({name: 'game'});
    onDialogHide()
    return;
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'El usuario ya existe, por favor ingresa otro nombre de usuario',
    });
  } finally {
    $q.loading.hide();
  }
}
</script>
