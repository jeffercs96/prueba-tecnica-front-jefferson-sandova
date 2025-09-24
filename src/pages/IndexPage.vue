<template>
  <q-layout>
    <q-page-container class="q-pa-md">
      <q-page class="row items-center justify-evenly">
        <q-card class="q-pa-md" style="width: 500px">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <p class="text-h4 text-primary text-weight-bold text-center">BIENVENIDO</p>
            <p>Por favor ingresa tu nombre de usuario:</p>
            <q-input
              filled
              v-model="name"
              label="Nombre de Usuario"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Por favor ingresa tu nombre de usuario',
              ]"
            />
            <div class="text-right">
              <span class="no-user text-red cursor-pointer" @click="openRegisterDialog" > No tienes usuario? crea uno ¡Ahora! </span>
            </div>

            <div>
              <q-btn
                class="full-width"
                label="Ingresar y divertirme"
                type="submit"
                color="primary"
                outline
                no-caps
              />
            </div>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useWalletStore } from 'stores/wallet';
import RegisterComponent from 'components/RegisterComponent.vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const name = ref<string>('');
const walletStore = useWalletStore();
const router = useRouter();

async function onSubmit() {
  try {
    $q.loading.show();
    await walletStore.loadWallet(name.value);
    await router.push({name: 'game'});
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'Usuario no encontrado, por favor cree uno nuevo',
    });
  } finally {
    $q.loading.hide();
  }
}

function openRegisterDialog() {
  $q.dialog({
    component: RegisterComponent,
    componentProps: {
      persistent: false,
    },
  });
}
</script>

<style lang="scss" scoped>
.no-user {
  &:hover {
    font-weight: bold;
  }
}
</style>
