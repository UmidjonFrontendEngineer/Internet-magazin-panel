'use client'
import Image from "next/image";
import { useThemeStore } from "@/src/store/useThemeStore";
import Link from "next/link";

export default function Dashboard() {
    const mode = useThemeStore(state => state.theme)
    let dark = mode === 'dark' ? true : false
    return (
        <div className="max-w-5xl space-y-8 animate-fade-in">
            <div className="space-y-1.5">
                <h1 className="text-xl font-semibold tracking-widest text-sky-500 uppercase">Dashboard</h1>
            </div>

            <section className="flex flex-col w-full gap-2 p-2 rounded-2xl bg-sky-100/10">
                <h1>sahifalar</h1>
                <Link href={'/products'}>products</Link>
                <Link href={'/search'}>search console</Link>
                <Link href={'/slider'}>slider</Link>
            </section>
        </div>
    );
}