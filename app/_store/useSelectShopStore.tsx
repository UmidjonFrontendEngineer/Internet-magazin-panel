import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface selectShopState {
    selectShop: string
    setSelectShop: (selectShop: string) => void
}

export const useSelectShopStore = create<selectShopState>()(
    persist(
        (set) => ({
            selectShop: '',
            setSelectShop: (selectShop) => set({ selectShop: selectShop }),
        }),
        {
            name: 'selectShop-storage',
        }
    )
)
