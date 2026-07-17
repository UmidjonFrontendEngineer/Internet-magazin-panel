'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/app/_store/useThemeStore";
import Image from "next/image";
import ThemeBtn from "./ThemeBtn";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const mode = useThemeStore(state => state.theme)
    const pathname = usePathname()
    const menuItems = [
        { name: "Dashboard", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Slider", path: "/slider" },
        { name: "Search", path: "/search" },
        { name: "Settings", path: "/settings" },
    ];

    let dark = mode === 'dark' ? true : false

    return (
        <html lang="uz">
            <body className={`${dark ? 'bg-[#09090b] text-[#f5f5f7]' : 'bg-[#f0f2f5] text-[#1d1d1f]'} antialiased duration-100 relative min-h-screen overflow-hidden`}>

                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-sky-600/30 to-sky-600/0 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-blue-600/20 to-cyan-600/0 blur-[150px] pointer-events-none z-0" />
                <div className={`absolute top-[30%] right-[-5%] w-[35vw] h-[35vw] rounded-full ${dark ? 'bg-sky-500/10' : 'bg-sky-500/20'} blur-[100px] pointer-events-none z-0`} />

                <div className="relative z-10 flex h-screen p-2 gap-5 overflow-hidden sm-hide">

                    <aside className={`relative w-72 rounded-[28px] ${dark ? 'bg-[#121214]/40 border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'bg-white/40 border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]'} max-[1000px]:hidden backdrop-blur-3xl border p-6 flex flex-col justify-between`}>
                        <div>
                            <div className="flex items-center justify-between px-2 mb-10">
                                <Link href='/'>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-900 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-500/20">
                                            G
                                        </div>
                                        <span className={`font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${dark ? 'to-neutral-400 from-neutral-900' : 'to-neutral-600 from-white'}`}>
                                            E-COMMERCE
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <nav className="space-y-1.5 overflow-y-scroll">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            className={`flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 group capitalize ${isActive
                                                ? "bg-gradient-to-r from-blue-600/90 to-sky-600/90 text-white shadow-[0_4px_30px_10px_rgba(138, 204, 255, 0.3)] translate-x-1"
                                                : `${dark ? 'text-neutral-500 hover:bg-white/5 hover:text-white' : 'text-neutral-400 hover:bg-black/5 hover:text-neutral-900'}`
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <Link href='https://internet-magazin-uzum.vercel.app' target="_blank" className="px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-sky-500 hover:bg-sky-600 active:scale-95 shadow-md shadow-sky-500/20 transition-all duration-200 dark:bg-sky-600 dark:hover:bg-sky-500 dark:shadow-sky-900/30 flex items-center gap-2">
                                    <span>Loyihaga o'tish</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </nav>
                        </div>

                        <ThemeBtn />
                    </aside>

                    <main className="flex-1 rounded-[28px] p-4 overflow-y-auto overflow-x-hidden relative">

                        <header className={`flex items-center absolute p-4 top-1 left-[50%] w-8/10 translate-x-[-50%] justify-between mb-8 font-semibold text-lg text-sky-500 rounded-full uppercase tracking-widest max-[500px]:text-[8px] border ${dark ? 'bg-[#121214]/40 border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'bg-white/40 border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]'}`}>
                            <Link className="hover:text-white hover:underline duration-200" href="/">dashboard</Link>
                            <Link className="hover:text-white hover:underline duration-200" href="/products">products</Link>
                            <Link className="hover:text-white hover:underline duration-200" href="/slider">slider</Link>
                            <Link className="hover:text-white hover:underline duration-200" href="/search">search</Link>
                        </header>
                        {children}
                    </main>

                </div>
            </body>
        </html>
    );
}