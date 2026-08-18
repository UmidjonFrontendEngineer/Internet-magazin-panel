'use client'

import { useThemeStore } from '@/app/_store/useThemeStore'
import GlassInput from '@/components/admin/GlassInput'
import React, { useState, useEffect, useRef } from 'react'

const MiniItem = ({ index, cIndex, setItemLenght }: { index: number, cIndex: number, setItemLenght: React.Dispatch<React.SetStateAction<number>> }) => {
    const [title, setTitle] = useState('')
    const [value, setValue] = useState<number>()

    const isFirstRun = useRef(true)
    const hasValue = useRef(false)

    const theme = useThemeStore(state => state.theme)
    const isSelected = false

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        const currentlyHasValue = title.trim() !== ''

        if (currentlyHasValue && !hasValue.current) {
            setItemLenght(prev => prev + 1)
            hasValue.current = true
        } else if (!currentlyHasValue && hasValue.current) {
            setItemLenght(prev => prev - 1)
            hasValue.current = false
        }
    }, [title, setItemLenght])

    return (
        <div
            className={`flex justify-between items-center text-xs font-medium px-4 py-3 rounded-lg border transition-all duration-200 ${isSelected
                ? "bg-sky-500/10 text-sky-500 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.1)]"
                : theme === 'dark'
                    ? "bg-zinc-800/20 text-zinc-300 border-zinc-800 hover:bg-zinc-800/40 hover:border-zinc-700"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                }`}
        >
            <GlassInput name={`title-${cIndex}-${index}`} onChange={(text: string) => setTitle(text)} value={title} />
            <GlassInput name={`value-${cIndex}-${index}`} type='number' onChange={(text: number) => setValue(text)} value={value} />
        </div>
    )
}

export default MiniItem