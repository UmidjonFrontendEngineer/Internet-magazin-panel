'use client'
import React, { useState, useEffect } from 'react'

const ProductOptionGroup = ({ groupIndex }: { groupIndex: number }) => {
    const [optionNum, setOptionNum] = useState(1)
    return (
        <div key={groupIndex} className='flex flex-col gap-6 bg-sky-100/10 rounded-2xl p-6'>
            <div className='flex gap-4 max-[500px]:flex-col'>
                <input type="text" name={`option${groupIndex + 1}Name`} className="rounded-[1rem] bg-sky-200/10 border w-1/2 border-sky-500/40 py-2 px-4 w-full outline-none" placeholder={`mahsulotning ${groupIndex + 1} - qismini nomini yozing...`} />
                <div className="flex gap-4 w-1/2 max-[500px]:w-full">
                    <button className="px-2 py-2 rounded-xl max-[500px]:text-sm capitalize active:scale-[0.95] hover:bg-sky-600/40 duration-200 font-semibold w-full bg-sky-600/60" onClick={() => setOptionNum(prev => prev + 1)}>qo'shish</button>
                    <button className="px-2 py-2 rounded-xl max-[500px]:text-sm capitalize active:scale-[0.95] hover:bg-rose-600/40 duration-200 font-semibold w-full bg-rose-600/60" onClick={() => {optionNum > 1 && setOptionNum(prev => prev - 1)}}>o'chirish</button>
                </div>
            </div>

            {Array(optionNum).fill(null).map((_, index) => (
                <div key={index} className='flex flex-col gap-3 bg-sky-50/10 rounded-2xl p-4'>
                    <input type="text" name={`option${groupIndex + 1}Name${index + 1}`} className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder={`mahsulotning ${groupIndex + 1} - qismining ${index + 1} - optionini nomini yozing...`} />
                    <input type="number" name={`option${groupIndex + 1}Value${index + 1}`} className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder={`mahsulotning ${groupIndex + 1} - qismining ${index + 1} - optionini narxini yozing...`} />
                </div>
            ))}
        </div>
    )
}

export default ProductOptionGroup