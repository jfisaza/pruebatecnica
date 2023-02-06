import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
    state: () => ({
        user: {},
        token: ''
    }),
    getters: {
      getUser: (state) => state.user,
      getToken: (state) => state.token
    },
    actions: {
        setUser(data){
            this.user = data
        },
        setToken(data){
            this.token = data
        }
    },
})