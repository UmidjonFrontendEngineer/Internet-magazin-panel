'use client'
import Image from "next/image";
import { useThemeStore } from "@/src/store/useThemeStore";

export default function Dashboard() {
    const mode = useThemeStore(state => state.theme)
    let dark = mode === 'dark' ? true : false
    return (
        <div className="max-w-5xl space-y-8 animate-fade-in">
            <div className="space-y-1.5">
                <h1 className="text-xl font-semibold tracking-widest text-sky-500 uppercase">Dashboard</h1>
            </div>

            <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-purple-900/40 via-neutral-900/70 to-black p-10 min-h-[260px] flex flex-col justify-between border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 opacity-30 mix-blend-color-dodge transition-transform duration-1000 group-hover:scale-105">
                    <Image
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000"
                        alt="Neon Aesthetic"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-xl space-y-3">
                    <span className="px-3 py-1 text-[11px] font-medium tracking-wider bg-white/10 rounded-full border border-white/10 text-pink-300 uppercase">
                        Jonli interfeys
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Xush kelibsiz, Admin!</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                        Barcha sahifalar to'liq dinamik ravishda bir-biriga bog'landi. Hech qanday og'ir kutubxonalarsiz, faqat eng toza Tailwind CSS arxitekturasi va shishasimon dizayn estetikasi.
                    </p>
                </div>

                <div className="relative z-10 flex gap-6 text-xs font-medium text-neutral-400 border-t border-white/5 pt-4 mt-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Tizim: <span className="text-emerald-400 font-semibold">Faol (Online)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        Metodlar: <span className="text-purple-400 font-semibold">Zustand Store</span>
                    </div>
                </div>
            </div>
        </div>
    );
}