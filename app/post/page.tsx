'use client';
import React, { useState, useEffect } from "react";
import { useThemeStore } from "@/src/store/useThemeStore";
import ProductOptionGroup from "../_components/ProductOptionGroup";

export default function PostPage() {
    const [gradient, setGradient] = useState("auto");
    const [optionsNum, setOptionsNum] = useState(0)
    const theme = useThemeStore(state => state.theme)
    let dark = theme === 'dark' ? true : false

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const dynamicOptions = [];

        for (let i = 0; i < optionsNum; i++) {
            const groupIndex = i + 1;
            const groupName = data[`option${groupIndex}Name`] as string;

            if (!groupName) continue;

            const subOptions = [];
            let subIndex = 1;

            while (data[`option${groupIndex}Name${subIndex}`] !== undefined) {
                const subName = data[`option${groupIndex}Name${subIndex}`] as string;
                const subValue = data[`option${groupIndex}Value${subIndex}`];

                if (subName) {
                    subOptions.push({
                        name: subName,
                        value: subValue ? Number(subValue) : 0
                    });
                }
                subIndex++;
            }

            dynamicOptions.push({
                name: groupName,
                options: subOptions
            });
        }

        const dataToSend = {
            title: data.title,
            description: {
                uz: data.descriptionUz,
                en: data.descriptionEn,
                ru: data.descriptionRu,
            },
            foiz: data.foiz ? Number(data.foiz) : 0,
            oy: data.oy ? Number(data.oy) : 0,
            keywords: data.keywords ? (data.keywords as string).split(',').map((keyword) => keyword.trim()) : [],
            gradient: data.gradient,
            options: dynamicOptions
        };

        console.log("Backendga ketadigan ma'lumot:", dataToSend);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error('Failed to create product');
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    }

    return (
        <div className="max-w-5xl space-y-6">
            <div className="space-y-1.5">
                <h1 className="text-4xl font-extrabold tracking-tight dark:text-white text-neutral-900">POST Request</h1>
            </div>

            <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
                <input type="text" name='title' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder="mahsulot titlesini yozing..." />
                <div className="flex gap-4">
                    <textarea name='descriptionUz' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none text-[10px]" placeholder="mahsulot descriptionini UZ yozing..." rows='10'></textarea>
                    <textarea name='descriptionEn' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none text-[10px]" placeholder="mahsulot descriptionini EN yozing..." rows='10'></textarea>
                    <textarea name='descriptionRu' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none text-[10px]" placeholder="mahsulot descriptionini RU yozing..." rows='10'></textarea>
                </div>
                <input type="number" name='foiz' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder="mahsulot foizini yozing..." />
                <input type="number" name='oy' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder="bo'lib to'lash oyini max yozing..." />
                <input type="text" name='keywords' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder="qidiruv uchun kalit so'zlarni o'rtada , bilan yozing..." />
                <label htmlFor="gradient">mahsulot gradienti</label>
                <select
                    name="gradient"
                    onChange={(e) => setGradient(e.target.value)}
                    value={gradient}
                    className={`rounded-[1rem] py-2 px-4 w-full outline-none border transition-all duration-200 cursor-pointer focus:border-sky-500 bg-sky-200/10
                    ${dark ? 'border-slate-700 text-slate-200' : 'border-slate-300 text-slate-800'}`}
                >
                    <option value="auto" className="bg-sky-200/10 text-slate-800">
                        Auto
                    </option>
                    <option value="custom" className="bg-sky-200/10 text-slate-800">
                        Custom
                    </option>
                </select>
                {gradient === "custom" ? (
                    <>
                        <input type="text" name='gradient' className="rounded-[1rem] bg-sky-200/10 border border-sky-500/40 py-2 px-4 w-full outline-none" placeholder="mahsulot gradientini , bilan yozing..." />
                    </>
                ) : null}
                <label htmlFor="">mahsulot qisimlari</label>
                <div className="flex gap-4 w-full">
                    <button type="button" className="capitalize px-4 py-4 rounded-3xl active:scale-[0.95] hover:bg-sky-600/40 duration-200 font-semibold w-full bg-sky-600/60 " onClick={() => setOptionsNum(prev => prev + 1)}>qo'shish</button>
                    <button type="button" className="capitalize px-4 py-4 rounded-3xl active:scale-[0.95] hover:bg-rose-600/40 duration-200 font-semibold w-full bg-rose-600/60 " onClick={() => {optionsNum > 0 && setOptionsNum(prev => prev - 1)}}>o'chirish</button>
                </div>
                {Array(optionsNum).fill(null).map((_, index) => (
                    <ProductOptionGroup key={index} groupIndex={index} />
                ))}
                <button type="submit" className="f-full bg-sky-600 hover:bg-sky-700 duration-300 text-white rounded-2xl py-2 text-2xl font-semibold select-none capitalize">databasega yozish</button>
            </form>
        </div>
    );
}