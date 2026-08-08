'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/app/_store/useThemeStore";
import Image from "next/image";
import ThemeBtn from "./ThemeBtn";
import LocaleSwitcher from "@/components/admin/LocaleSwitcher";
import { useEffect, useRef, useState } from "react";
import GlassTable from "@/components/admin/GlassTable";
import { motion, AnimatePresence } from 'framer-motion';
import GlassMenu from "@/components/GlassNavItem";
import { useTokenStore } from "../_store/useTokenStore";
import { useSelectMarketStore } from "../_store/useSelectMarketStore";
import { useParams } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, []);

    const mode = useThemeStore(state => state.theme)
    const pathname = usePathname()
    const lan = pathname.split('/')[1]
    const token = useTokenStore(state => state.token)
    const [menu, setMenu] = useState(true)
    const [acces, setAcces] = useState(false)
    const [tab, setTab] = useState(-1)
    const [menuType, setMenuType] = useState('')
    const [role, setRole] = useState('')
    const selectMarket = useSelectMarketStore(state => state.selectMarket)

    const params = useParams()
    const locale = params.locale || 'uz'

    let dark = mode === 'dark' ? true : false

    const renderToken = async (token: string) => {
        console.log("Yuborilayotgan token:", token);
        if (!token) {
            console.log("Token mavjud emas!");
            setAcces(false)
            return;
        }
        try {
            const res = await fetch(`https://internet-magazin-nest-server.onrender.com/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Server xatosi:", errorText);
                setAcces(false)
                return;
            }

            const req = await res.json();
            console.log(req);
            setAcces(true);
        } catch (err) {
            console.log("Fetch xatosi:", err);
            setAcces(false);
        }
    }

    useEffect(() => {
        renderToken(token);

        setInterval(() => console.log(acces, role), 1000)
    }, [token]);

    useEffect(() => {
        if (acces && selectMarket) {
            if (role === '' || !role) {
                setMenuType('owner');
            } else if (role === 'admin') {
                setMenuType('admin');
            } else if (role === 'wherehouse') {
                setMenuType('wherehouse');
            } else if (role === 'cashier') {
                setMenuType('cashier');
            } else {
                setMenuType('noWork');
            }
        } else if ((!acces && selectMarket) || (!acces)) {
            setMenuType('noAcces');
        }
    }, [acces, selectMarket, role]);


    useEffect(() => { setMenu(window.innerWidth > 500 ? true : false) }, [])

    useEffect(() => {
        const newPath = pathname.split('/')[3]

        console.log(newPath)

        if (newPath === 'dashboard') setTab(1)
        else if (newPath === 'nimadir') setTab(2)
        else if (newPath === 'nimadir') setTab(3)
        else if (newPath === 'nimadir') setTab(4)
        else if (newPath === 'vacancy') setTab(5)
        else if (newPath === 'nimadir') setTab(6)
        else if (newPath === 'nimadir') setTab(7)
        else if (newPath === 'nimadir') setTab(8)
        else { setTab(9) }
    }, [pathname])

    // ===============================================================

    const wherehouse = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Wherehouses', href: '/wherehouses' },
    ];

    // ____________________________________________________________

    const products = [
        { label: 'Products', href: '/products' },
        { label: 'Comments', href: '/comments' },
        { label: 'Reactions', href: '/reactions' },
        { label: 'Reports', href: '/reports' },
    ];

    // ===============================================================

    const stockLevels = [
        { label: 'Real-time Stock', href: '/real-time-stock' },
        { label: 'Dead Stock', href: '/dead-stock' },
        { label: 'Low Stock Alerts', href: '/low-stock-alerts' },
    ];

    // _______________________________________________________________

    const stockMovement = [
        { label: 'Incoming Flow', href: '/incoming-flow' },
        { label: 'Outgoing Flow', href: '/outgoing-flow' },
        { label: 'Internal Transfers', href: '/internal-transfers' },
    ];


    // _______________________________________________________________

    const salesPerformance = [
        { label: 'Top Products', href: '/top-products' },
        { label: 'Category Sales', href: '/category-sales' },
        { label: 'Peak Hours/Days', href: '/peak-hours-days' },
    ];

    // _______________________________________________________________

    const demandForecasting = [
        { label: 'Predicted Shortages', href: '/predicted-shortages' },
        { label: 'Seasonal Trends', href: '/seasonal-trends' },
    ];

    // _______________________________________________________________

    const valueAndCost = [
        { label: 'Total Stock Value', href: '/total-stock-value' },
        { label: 'Holding Costs', href: '/holding-costs' },
    ];

    // _______________________________________________________________

    const profitability = [
        { label: 'Margin Analysis', href: '/margin-analysis' },
        { label: 'Revenue Reports', href: '/revenue-reports' },
    ];

    // _______________________________________________________________

    const inventoryTurnover = [
        { label: 'Inventory Turnover Rate', href: '/inventory-turnover-rate' },
        { label: 'Days in Warehouse', href: '/days-in-warehouse' },
    ];

    // _______________________________________________________________

    const fulfillment = [
        { label: 'Order Processing Time', href: '/order-processing-time' },
        { label: 'Return Rates', href: '/return-rates' },
    ];

    // ===============================================================

    const catalogCategories = [
        { label: 'Categories List', href: '/categories' },
        { label: 'Category CRUD', href: '/categories/manage' },
    ];

    // _______________________________________________________________

    const catalogSearch = [
        { label: 'Search Keywords', href: '/search-keywords' },
        { label: 'Filters & Attributes', href: '/attributes' },
    ];

    // ===============================================================

    const users = [
        { label: 'All Users', href: '/all-users' },
        { label: 'New Users', href: '/new-users' },
        { label: 'Blocked Users', href: '/blocked-users' },
    ];

    // _______________________________________________________________

    const workers = [
        { label: 'All workers', href: '/all-workers' },
        { label: 'Admins', href: '/admins' },
        { label: 'Wherehouses', href: '/wherehouses' },
        { label: 'Salers', href: '/salers' },
        { label: 'Managers', href: '/managers' },
    ];

    // ===============================================================

    const workRelated = [
        { label: 'All Chats', href: '/work-all-chats' },
        { label: 'General Work Group', href: '/work-general-group' },
        { label: 'Direct Messages', href: '/work-direct-messages' },
    ];

    // _______________________________________________________________

    const customerInquiries = [
        { label: 'All Inquiries', href: '/inquiries-all' },
        { label: 'Important Inquiries', href: '/inquiries-important' },
        { label: 'Unimportant Inquiries', href: '/inquiries-unimportant' },
    ];

    // _______________________________________________________________

    const complaints = [
        { label: 'All Complaints', href: '/complaints-all' },
        { label: 'New Complaints', href: '/complaints-new' },
    ];

    // ===============================================================

    return (
        <div>
            <div className={`${dark ? 'bg-[#09090b] text-[#f5f5f7]' : 'bg-[#f0f2f5] text-[#1d1d1f]'} antialiased duration-100 relative min-h-screen overflow-hidden`}>

                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-sky-600/30 to-sky-600/0 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-blue-600/20 to-cyan-600/0 blur-[150px] pointer-events-none z-0" />
                <div className={`absolute top-[30%] right-[-5%] w-[35vw] h-[35vw] rounded-full ${dark ? 'bg-sky-500/10' : 'bg-sky-500/20'} blur-[100px] pointer-events-none z-0`} />

                <div className="relative z-1000000000 flex h-screen p-2 gap-5 max-w-[1700px] mx-auto sm-hide justify-center">
                    <div className="fixed inset-0 pointer-events-none z-50 p-4 md:p-6 flex items-center justify-start gap-4">

                        <div className={`w-full h-[10vh] z-9999 fixed top-0 duration-300 left-0 bg-gradient-to-b ${dark ? 'from-[#18181b] to-transparent' : 'from-white to-transparent'}`}></div>
                        <div className={`w-full h-[10vh] z-9999 fixed bottom-0 duration-300 left-0 bg-gradient-to-t ${dark ? 'from-[#18181b] to-transparent' : 'from-white to-transparent'}`}></div>

                        <button
                            className={`pointer-events-auto fixed z-9999 lg:top-6 lg:left-6 top-2 left-2 shadow-2xl shadow-black/20 flex items-center justify-center rounded-full p-0 lg:w-12 lg:h-12 w-10 h-10 transition-all duration-300 ease-out backdrop-blur-xl border ${dark
                                ? "bg-neutral-900/40 text-neutral-300 hover:bg-neutral-800/60 hover:text-white border-white/10 shadow-lg shadow-indigo-400/500"
                                : "bg-white/40 text-neutral-700 hover:bg-white/70 hover:text-neutral-900 border-black/10 shadow-lg shadow-black/5"
                                } hover:scale-105 active:scale-80`}
                            onClick={() => setMenu(prev => !prev)}
                            aria-label="Toggle Menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {menu ? (
                                    <>
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M4 5h16" />
                                        <path d="M4 12h16" />
                                        <path d="M4 19h16" />
                                    </>
                                )}
                            </svg>
                        </button>

                        <AnimatePresence>
                            {menu && (
                                <motion.nav
                                    initial={{ opacity: 0, x: -50, scale: 0.2 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -50, scale: 0.2 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className={`pointer-events-auto flex flex-col space-y-2 overflow-y-auto max-h-[85vh] py-4 px-2.5 rounded-3xl backdrop-blur-2xl border shadow-2xl shadow-black/20 ${dark
                                        ? "bg-neutral-900/20 border-white/10 text-white"
                                        : "bg-white/20 border-white/60 text-neutral-900"
                                        }`}
                                >
                                    {
                                        (menuType === 'owner' || menuType === 'admin') ? (
                                            <>

                                                <Link
                                                    href={`/${locale}/${selectMarket.replaceAll(' ', '_')}/dashboard`}
                                                    className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark
                                                        ? "hover:bg-white/10 text-neutral-300 hover:text-white"
                                                        : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"
                                                        }`}
                                                >
                                                    {tab === 1 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={tab === 1 ? 'text-sky-500' : ''}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                                                </Link>

                                                <button onClick={() => setTab(2)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 2 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box-icon lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                                                </button>

                                                <button onClick={() => setTab(3)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 3 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-spline-icon lucide-chart-spline"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" /></svg>
                                                </button>

                                                <button onClick={() => setTab(4)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 4 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-sort-ascending-icon lucide-list-sort-ascending"><path d="M3 19h18" /><path d="M15 12H3" /><path d="M9 5H3" /></svg>
                                                </button>
                                                
                                                <Link
                                                    href={`/${locale}/${selectMarket.replaceAll(' ', '_')}/vacancy`}
                                                    className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark
                                                        ? "hover:bg-white/10 text-neutral-300 hover:text-white"
                                                        : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"
                                                        }`}
                                                >
                                                    {tab === 5 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /></svg>
                                                </Link>

                                                <button onClick={() => setTab(6)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 6 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
                                                </button>

                                                <button onClick={() => setTab(7)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 7 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></svg>
                                                </button>

                                                <button onClick={() => setTab(8)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 8 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>

                                                <Link
                                                    href='/profile'
                                                    className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark
                                                        ? "hover:bg-white/10 text-neutral-300 hover:text-white"
                                                        : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"
                                                        }`}
                                                >
                                                    {tab === 9 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={tab === 9 ? 'text-sky-500' : ''}><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                                                </Link>
                                            </>
                                        ) : (menuType === 'noAcces' || menuType === 'noWork') ? (
                                            <>
                                                <Link
                                                    href={`/${locale}/vacancy/vacancy`}
                                                    className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark
                                                        ? "hover:bg-white/10 text-neutral-300 hover:text-white"
                                                        : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"
                                                        }`}
                                                >
                                                    {tab === 1 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /></svg>
                                                </Link>

                                                <button onClick={() => setTab(8)} className={`active:scale-80 group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark ? "hover:bg-white/10 text-neutral-300 hover:text-white" : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"}`}>
                                                    {tab === 8 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>

                                                <Link
                                                    href='/profile'
                                                    className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${dark
                                                        ? "hover:bg-white/10 text-neutral-300 hover:text-white"
                                                        : "hover:bg-black/5 text-neutral-700 hover:text-neutral-900"
                                                        }`}
                                                >
                                                    {tab === 9 && <div className="absolute inset-0 rounded-2xl bg-sky-500/20 border border-sky-400/30" />}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={tab === 9 ? 'text-sky-500' : ''}><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                                                </Link>
                                            </>
                                        ) : null
                                    }
                                </motion.nav>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {(menu && tab !== 1 && tab !== 9) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6, y: 0 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.6, y: 0 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className={`pointer-events-auto h-screen py-4 overflow-y-auto grid grid-cols-1 place-items-center`}
                                    ref={containerRef}
                                >
                                    <div className="w-full max-w-md flex flex-col gap-2">
                                        {tab === 2 ?
                                            <>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="WHEREHOUSE"
                                                        items={wherehouse}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="PRODUCTS"
                                                        items={products}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                            </> : null}
                                        {tab === 3 ?
                                            <>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Stock Levels"
                                                        items={stockLevels}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Stock Movement"
                                                        items={stockMovement}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Performance"
                                                        items={salesPerformance}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Demand Forecasting"
                                                        items={demandForecasting}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Value & Cost"
                                                        items={valueAndCost}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Profitability"
                                                        items={profitability}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Turnover"
                                                        items={inventoryTurnover}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                                <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                    ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                    : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                    }`}>
                                                    <GlassMenu
                                                        title="Fulfillment"
                                                        items={fulfillment}
                                                        defaultOpen={true}
                                                    />
                                                </div>
                                            </> : null}
                                        {tab === 4 ? <>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Catalog Categories"
                                                    items={catalogCategories}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Catalog Search"
                                                    items={catalogSearch}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                        </> : null}
                                        {tab === 6 ? <>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Workers"
                                                    items={workers}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Users"
                                                    items={users}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                        </> : null}
                                        {tab === 7 ? <>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Work Related"
                                                    items={workRelated}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Customer Inquiries"
                                                    items={customerInquiries}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                            <div className={`backdrop-blur-2xl rounded-3xl ${dark
                                                ? "bg-neutral-900/20 border-white/10 text-white shadow-xl shadow-black/20"
                                                : "bg-white/20 border-white/60 text-neutral-900 shadow-xl shadow-black/20"
                                                }`}>
                                                <GlassMenu
                                                    title="Complaints"
                                                    items={complaints}
                                                    defaultOpen={true}
                                                />
                                            </div>
                                        </> : null}
                                        {tab === 8 ? <>
                                            <LocaleSwitcher />
                                            <ThemeBtn />
                                        </> : null}
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    <div className='fixed top-3 right-3 z-9999'>
                        <ThemeBtn />
                    </div>

                    <main className="flex-1 w-full p-4 overflow-y-auto overflow-x-hidden relative">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    );
}