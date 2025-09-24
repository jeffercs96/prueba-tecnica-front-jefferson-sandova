import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    name: LocalStorage.getItem('walletName') || '',
    balance: parseFloat(LocalStorage.getItem('walletBalance') || '0'),
  }),
  actions: {
    saveToStorage() {
      LocalStorage.set('walletName', this.name)
      LocalStorage.set('walletBalance', this.balance.toString())
    },
    async loadWallet(name:string) {
      const res = await api.get(`/api/Wallet/${name}`)
      this.name = res.data.name
      this.balance = res.data.balance
      this.saveToStorage()
    },
    async saveWallet(name: string, balance: number) {
      const res = await api.post('/api/Wallet/save', { name, balance })
      this.name = res.data.name
      this.balance = res.data.balance
      this.saveToStorage()
    },
    async updateWallet(name: string, amount:number) {
      const res = await api.put('/api/Wallet/update', { name, amount })
      this.balance = res.data.balance
      this.saveToStorage()
    },
    logout() {
      this.name = ''
      this.balance = 0
      LocalStorage.remove('walletName')
      LocalStorage.remove('walletBalance')
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot));
}
