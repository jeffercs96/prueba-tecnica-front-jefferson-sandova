import { defineStore } from 'pinia'
import { type BetResponse } from 'stores/roulette'
import { LocalStorage } from 'quasar'

export interface BetHistoryItem extends BetResponse {
  timestamp: string
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    bets: [] as BetHistoryItem[]
  }),
  actions: {
    addBet(bet: BetResponse) {
      this.bets.unshift({
        ...bet,
        timestamp: new Date().toLocaleString()
      })
      LocalStorage.set('betHistory', this.bets)
    },
    loadHistory() {
      const saved = LocalStorage.getItem('betHistory') as BetHistoryItem[];
      if (saved) {
        this.bets = saved
      }
    },
    clearHistory() {
      this.bets = []
      LocalStorage.remove('betHistory')
    }
  }
})
