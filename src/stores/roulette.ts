import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import {Notify, Loading} from 'quasar';

export enum RouletteColor {
  Red,
  Black,
}
export enum BetType {
  Color = 1,        // Bet on a color (Red/Black)
  ColorParity = 2,  // Bet on even/odd of a color (Red even, Black odd, etc.)
  NumberColor = 3   // Bet on number + color (e.g., 13-Red, 7-Black, etc.)
}

export enum Parity {
  Even, // par
  Odd // impar
}
export interface SpinResultResponse {
  number: number
  color: RouletteColor
}

export interface BetRequest {
  playerName: string
  amount: number
  betType: BetType
  colorChoice?: RouletteColor
  parityChoice?: Parity
  numberChoice?: number
  spinNumber: number
  spinColor: RouletteColor
}

export interface BetResponse {
  playerName: string
  spinNumber: number
  spinColor: RouletteColor
  isWin: boolean
  payout: number
  newBalance: number
}

export const useRouletteStore = defineStore('roulette', {
  state: () => ({
    lastSpin: null as SpinResultResponse | null,
    lastBet: null as BetResponse | null,
    loading: false,
  }),

  actions: {
    // Girar la ruleta
    async spin() {
      Loading.show()
      try {
        const res = await api.get<SpinResultResponse>('/api/Roulette/spin')
        this.lastSpin = res.data
        return this.lastSpin
      } catch (err) {
        Notify.create({
          type: 'negative',
          message: 'Error al girar la ruleta',
          timeout: 3000,
        })
        console.error('Error al girar la ruleta:', err)
        return null
      } finally {
        Loading.hide()
      }
    },

    // Apostar y calcular premio
    async bet(request: BetRequest) {
      Loading.show()
      try {
        const res = await api.post<BetResponse>('/api/Roulette/prize', request)
        this.lastBet = res.data
        return this.lastBet
      } catch (err) {
        console.error('Error en la apuesta:', err)
        Notify.create({
          type: 'negative',
          message: 'Error al procesar la apuesta',
          timeout: 3000,
        })
        return null
      } finally {
        Loading.hide()
      }
    },

    // Resetear estado
    clear() {
      this.lastSpin = null
      this.lastBet = null
    }
  }
})
