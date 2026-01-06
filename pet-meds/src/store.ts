import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Username {
    name: string
    setName: (newName: string) => void
}

export const useNameStore = create<Username>()(
    persist(
        (set) => ({
            name: "",
            setName: (newName) => set((_) => ({ name: newName }))
        }),
        {
            name: "username-storage"
        }
    )
)