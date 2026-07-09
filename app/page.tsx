'use client'
import Image from "next/image";
import { useThemeStore } from "@/src/store/useThemeStore";
import Link from "next/link";

export default function Dashboard() {
    const mode = useThemeStore(state => state.theme)
    let dark = mode === 'dark' ? true : false
    return (
        <div className="max-w-5xl space-y-8 animate-fade-in mt-14">
            <div className="space-y-1.5">
                <h1 className="text-xl font-semibold tracking-widest text-sky-500 uppercase">Dashboard</h1>
            </div>

            <section className="flex flex-col w-full gap-1.5 p-3 rounded-2xl bg-sky-100/10 border border-sky-500 backdrop-blur-sm">
                <h1 className="px-2 text-xs font-bold tracking-wider uppercase text-sky-600/80 dark:text-sky-400/80 mb-1">
                    Sahifalar
                </h1>

                <Link href="/products" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-300/20 transition-all duration-150 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform duration-150" />
                    <span className="capitalize">Products</span>
                </Link>

                <Link href="/search" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-300/20 transition-all duration-150 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform duration-150" />
                    <span className="capitalize">Search Console</span>
                </Link>

                <Link href="/slider" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-300/20 transition-all duration-150 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform duration-150" />
                    <span className="capitalize">Slider</span>
                </Link>
            </section>

            <section className="mt-3">
                <Link href="https://internet-magazin-uzum.vercel.app" target="_blank" className="w-full justify-center px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-sky-500 hover:bg-sky-600 active:scale-[0.98] shadow-md shadow-sky-500/20 transition-all duration-200 dark:bg-sky-600 dark:hover:bg-sky-500 dark:shadow-sky-900/30 flex items-center gap-2">
                    <span>Loyihaga o'tish</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </section>
        </div>
    );
}