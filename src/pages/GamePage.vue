<template>
  <q-page class="column q-gutter-md q-pa-md items-center">
    <q-card style="max-width: 500px; width: 100%">
        <q-form @submit="play">
      <q-card-section>
        <div class="text-h6 text-center">🎰 Juego de Ruleta</div>
        <div class="text-subtitle1 text-center flex justify-center items-center q-gutter-sm">
          <span>Saldo: ${{ wallet.balance }} </span>
          <q-btn
            dense
            label="Cargar saldo"
            color="positive"
            no-caps
            :to="{ name: 'load-credit' }"
          />
        </div>
      </q-card-section>

          <!-- Tipo de apuesta -->
          <q-card-section>
            <q-select
              v-model="betTypeSelected"
              :options="betTypeOptions"
              label="Tipo de apuesta"
              outlined
              :rules="[(val) => (val !== null && val !== undefined) || 'Selecciona un tipo de apuesta']"
            />
          </q-card-section>

          <!-- Apuesta por Color -->
          <q-card-section v-if="betTypeSelected?.value === BetType.Color">
            <q-select
              v-model="colorChoice"
              :options="colorOptions"
              label="Escoge un color"
              outlined
              :rules="[(val) => (val !== null && val !== undefined) || 'Selecciona un color']"
            />
          </q-card-section>

          <!-- Apuesta por Color + Paridad -->
          <q-card-section v-if="betTypeSelected?.value === BetType.ColorParity">
            <q-select v-model="colorChoice" :options="colorOptions" label="Escoge un color" outlined />
            <q-select
              v-model="parityChoice"
              :options="parityOptions"
              label="Escoge paridad"
              outlined
              class="q-mt-md"
              :rules="[(val) => (val !== null && val !== undefined) || 'Selecciona un tipo de paridad']"
            />
          </q-card-section>

          <!-- Apuesta por Número + Color -->
          <q-card-section v-if="betTypeSelected?.value === BetType.NumberColor">
            <q-input
              v-model.number="numberChoice"
              type="number"
              label="Número (0-36)"
              outlined
              :min="0"
              :max="36"
              :rules="[
                (val) => (val !== null && val !== undefined) || 'Ingresa un número',
                (val) => (val >= 0 && val <= 36) || 'El número debe estar entre 0 y 36',
              ]"
            />
            <q-select
              v-model="colorChoice"
              :options="colorOptions"
              label="Escoge un color"
              outlined
              class="q-mt-md"
              :rules="[(val) => (val !== null && val !== undefined) || 'Selecciona un color']"
            />
          </q-card-section>

          <!-- Monto a apostar -->
          <q-card-section>
            <q-input
              v-model.number="betAmount"
              type="number"
              label="Monto a apostar"
              outlined
              :min="1"
            />
          </q-card-section>

          <!-- Botón jugar -->
          <q-card-actions align="center">
            <q-btn
              color="primary"
              label="🎲 Girar y Apostar"
              type="submit"
              :loading="roulette.loading"
            />
          </q-card-actions>

          <!-- Resultado del spin -->
          <q-separator />

          <q-card-section v-if="roulette.lastSpin">
            <div class="text-subtitle1 text-center">
              Resultado: {{ roulette.lastSpin.number }} - {{ roulette.lastSpin.color }}
            </div>
          </q-card-section>

          <!-- Resultado de la apuesta -->
          <q-card-section v-if="roulette.lastBet">
            <div v-if="roulette.lastBet.isWin" class="text-positive text-center text-h6">
              ✅ ¡Ganaste {{ roulette.lastBet.payout }}!
            </div>
            <div v-else class="text-negative text-center text-h6">❌ Perdiste {{ persistBetAmount }}</div>
            <div class="text-subtitle2 text-center">
              Nuevo saldo: ${{ roulette.lastBet.newBalance }}
            </div>
          </q-card-section>

        </q-form>

    </q-card>

    <q-card style="max-width: 500px; width: 100%">
      <bet-history />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWalletStore } from 'stores/wallet';
import { BetType, Parity, RouletteColor, useRouletteStore } from 'stores/roulette';
import BetHistory from 'components/BetHistory.vue';
import { useHistoryStore } from 'stores/history';

const wallet = useWalletStore();
const roulette = useRouletteStore();
const history = useHistoryStore();

interface IOption {
  label: string;
  value: BetType | RouletteColor | Parity;
}

// Estado de UI
const betAmount = ref<number>(10);
const betTypeSelected = ref<IOption | null>(null); // valor inicial
const colorChoice = ref<IOption | null>(null);
const parityChoice = ref<IOption | null>(null);
const numberChoice = ref<number>(0);
const persistBetAmount = ref<number>(0);

// Opciones de tipo de apuesta
const betTypeOptions = [
  { label: 'Color', value: BetType.Color },
  { label: 'Color + Paridad', value: BetType.ColorParity },
  { label: 'Número + Color', value: BetType.NumberColor },
];

// Opciones de color
const colorOptions = [
  { label: 'Rojo', value: RouletteColor.Red },
  { label: 'Negro', value: RouletteColor.Black },
];

// Opciones de paridad
const parityOptions = [
  { label: 'Par', value: Parity.Even },
  { label: 'Impar', value: Parity.Odd },
];

async function play() {
  const spin = await roulette.spin();
  if (!spin) return;

  const bet = await roulette.bet({
    playerName: wallet.name,
    amount: betAmount.value,
    betType: betTypeSelected.value?.value as BetType,
    colorChoice: colorChoice.value?.value as RouletteColor,
    parityChoice: parityChoice.value?.value as Parity,
    numberChoice: numberChoice.value,
    spinNumber: spin.number,
    spinColor: spin.color,
  });

  if (bet) {
    persistBetAmount.value = betAmount.value;
    wallet.updateBalance(bet.newBalance);
    history.addBet(bet);
  }
}
</script>
