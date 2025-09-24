<template>
  <q-page class="q-pa-lg flex flex-center">
    <q-card class="q-pa-md q-ma-md" style="max-width: 500px; width: 100%">
      <q-card-section>
        <div class="text-h6 text-center">🎰 Juego de Ruleta</div>
        <div class="text-subtitle1 text-center">Saldo: ${{ wallet.balance }}</div>
      </q-card-section>

      <!-- Tipo de apuesta -->
      <q-card-section>
        <q-select
          v-model="betTypeSelected"
          :options="betTypeOptions"
          label="Tipo de apuesta"
          outlined
        />
      </q-card-section>

      <!-- Apuesta por Color -->
      <q-card-section v-if="betTypeSelected?.value === BetType.Color">
        <q-select v-model="colorChoice" :options="colorOptions" label="Escoge un color" outlined />
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
        />
        <q-select
          v-model="colorChoice"
          :options="colorOptions"
          label="Escoge un color"
          outlined
          class="q-mt-md"
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
          @click="jugar"
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
        <div v-else class="text-negative text-center text-h6">❌ Perdiste {{ betAmount }}</div>
        <div class="text-subtitle2 text-center">Nuevo saldo: {{ roulette.lastBet.newBalance }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWalletStore } from 'stores/wallet';
import { BetType, Parity, RouletteColor, useRouletteStore } from 'stores/roulette';

const wallet = useWalletStore();
const roulette = useRouletteStore();

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

const jugar = async () => {
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
    await wallet.loadWallet(wallet.name)
  }
};
</script>
