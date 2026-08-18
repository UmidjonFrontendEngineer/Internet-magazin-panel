'use client'

import React, { useEffect, useState, useRef } from 'react'
import MiniItem from './miniItem'
import { useThemeStore } from '@/app/_store/useThemeStore'
import GlassInput from '@/components/admin/GlassInput'

const Item = ({ cIndex, setItemsLenght }: { cIndex: number, setItemsLenght: React.Dispatch<React.SetStateAction<number>> }) => {

    const [title, setTitle] = useState('')
    const [itemLenght, setItemLenght] = useState(1)

    const isFirstRun = useRef(true)
    const hasValue = useRef(false)

    const theme = useThemeStore(state => state.theme)

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        const currentlyHasValue = title.trim() !== ''

        if (currentlyHasValue && !hasValue.current) {
            setItemsLenght(prev => prev + 1)
            hasValue.current = true
        } else if (!currentlyHasValue && hasValue.current) {
            setItemsLenght(prev => prev - 1)
            hasValue.current = false
        }
    }, [title, setItemsLenght])

    return (
        <div className={`p-4 flex flex-col gap-4 backdrop-blur-sm rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-gray-50 border-zinc-200'}`}>
            <GlassInput onChange={(e) => setTitle(e.target.value)} value={title} name={`title-${cIndex}`} placeholder='option title' />
            <div className="flex flex-col gap-2">
                {Array.from({ length: itemLenght }).map((_, index) => (
                    <MiniItem key={index} index={index} cIndex={cIndex} setItemLenght={setItemLenght} />
                ))}
            </div>
        </div>
    )
}

export default Item