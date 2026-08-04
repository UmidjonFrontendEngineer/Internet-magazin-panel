import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface tokenState {
    token: string
    setToken: (token: string) => void
}

export const useTokenStore = create<tokenState>()(
    persist(
        (set) => ({
            token: '',
            setToken: (token) => set({ token: token }),
        }),
        {
            name: 'token-storage',
        }
    )
)
