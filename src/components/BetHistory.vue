<template>
  <q-card class="q-mt-md">
    <q-card-section>
      <div class="text-h6">Historial de Apuestas</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-table
        :rows="history.bets"
        :columns="columns"
        row-key="timestamp"
        flat
        dense
      >
        <template v-slot:body-cell-isWin="props">
          <q-td :props="props">
            <q-badge :color="props.row.isWin ? 'positive' : 'negative'" outline>
              {{ props.row.isWin ? 'Ganó' : 'Perdió' }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useHistoryStore } from 'stores/history'

const history = useHistoryStore()
history.loadHistory()

const columns = [
  { name: 'timestamp', label: 'Fecha', field: 'timestamp', align: 'left' },
  { name: 'spinNumber', label: 'Número', field: 'spinNumber', align: 'center' },
  { name: 'spinColor', label: 'Color', field: 'spinColor', align: 'center' },
  { name: 'isWin', label: 'Resultado', field: 'isWin', align: 'center' },
  { name: 'payout', label: 'Premio', field: 'payout', align: 'right' },
  { name: 'newBalance', label: 'Saldo', field: 'newBalance', align: 'right' },
]
</script>
