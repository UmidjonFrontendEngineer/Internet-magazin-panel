"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassTable from "@/components/admin/GlassTable";
import GlassModal from "@/components/admin/GlassModal";
import GlassCard from "@/components/admin/GlassCard";
import GlassButton from "@/components/admin/GlassButton";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { useNotification } from "@/components/Notification";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";
import GlassInput from "@/components/admin/GlassInput";
import DatePicker from "react-datepicker";

interface Discount {
    id: string
    title: string
    percentage: number
    startDate: string
    endDate: string
    market: string
    [key: string]: unknown
}

function ApplicationsContent() {
    const searchParams = useSearchParams();
    const notify = useNotification()
    const [loading, setLoading] = useState<boolean>(true);
    const [imageModal, setImageModal] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const token = useTokenStore(state => state.token)
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const selectMarket = useSelectMarketStore(state => state.selectMarket)
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://internet-magazin-nest-server.onrender.com/discounts")

                const req = await res.json()

                if (res.ok) {
                    const filteredData = req.filter((item: Discount) => item.market === selectMarket)
                    setDiscounts(filteredData)
                }
            } catch (err) {
                console.error("Xatolik:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const formDataObj = new FormData(form)

        formDataObj.append('marketId', selectMarket)

        try {
            const res = await fetch('https://internet-magazin-nest-server.onrender.com/discounts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataObj
            })

            const req = await res.json()

            if (res.ok) {
                setIsOpen(false)
                notify.show("Yangi chegirma muaffaqiyatli qo'shildi", 'success', dark ? 'dark' : 'light')
                form.reset()
            } else {
                notify.show(req.message || 'Nimadir xato ketdi', 'error', dark ? 'dark' : 'light')
            }
        } catch (err) {
            notify.show("So'rov yuborilmadi", 'error', dark ? 'dark' : 'light')
            console.log(err)
        }
    }

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Discounts</h1>
                </div>

                <GlassButton onClick={() => setIsOpen(true)}>
                    Create Discount
                </GlassButton>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500 text-lg">Yuklanmoqda...</div>
            ) : (
                <GlassTable
                    columns={[
                        { key: "title", label: "title" },
                        { key: "percentage", label: "percentage" },
                        { key: "startDate", label: "startDate" },
                        { key: "endDate", label: "endDate" },
                    ]}
                    data={discounts as Record<string, unknown>[]}
                    actions={(row) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    // onClick={() => setSelectedUser(user)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition text-gray-200"
                                >
                                    Profil
                                </button>
                                {/* {workers.some(item => item.vacancyId === queryId && item.userId === user.id) ? (
                                    <button
                                        className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                                    >
                                        Accepted
                                    </button>
                                ) : ( */}
                                <button
                                    // onClick={() => handleAccept(user.id, selectMarket, queryId)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                                >
                                    Qabul
                                </button>
                                {/* )} */}
                                <button
                                    // onClick={() => handleDelete(user.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                                <button
                                    // onClick={() => setMessageModal(user.email)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                </button>
                            </div>
                        );
                    }}
                />
            )}

            <GlassModal className="overflow-visible" title="Create discount" open={isOpen} onClose={() => setIsOpen(false)}>
                <form className="relative space-y-4 max-h-[80vh] w-full overflow-visible" onSubmit={handleDiscount}>
                    <GlassInput placeholder='Discount title...' name="title" />
                    <GlassInput placeholder='Discount percentage...' name="percentage" type="number" />

                    <div className="relative flex items-center">
                        <span className="absolute left-4 z-10 text-neutral-400 pointer-events-none flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-arrow-down">
                                <path d="m14 17 4 4 4-4" /><path d="M16 2v3" /><path d="M18 13v8" /><path d="M21 10.354V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h7.343" /><path d="M3 9h18" /><path d="M8 2v3" />
                            </svg>
                        </span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm:ss"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            placeholderText="Start date & time..."
                            popperClassName="z-50"
                            className="w-full rounded-2xl py-3 pl-12 pr-4 outline-none transition-all duration-200 border focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        />
                    </div>

                    <div className="relative flex items-center">
                        <span className="absolute left-4 z-10 text-neutral-400 pointer-events-none flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-arrow-up">
                                <path d="m14 17 4-4 4 4" /><path d="M16 2v3" /><path d="M18 21v-8" /><path d="M21 10.343V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h9" /><path d="M3 9h18" /><path d="M8 2v3" />
                            </svg>
                        </span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm:ss"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            placeholderText="End date & time..."
                            popperClassName="z-50"
                            className="w-full rounded-2xl py-3 pl-12 pr-4 outline-none transition-all duration-200 border focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        />
                    </div>

                    <div className="p-6"></div>

                    <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px] bg-neutral-900/40">
                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Bekor qilish
                        </button>
                        <GlassButton
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                        >
                            Yuborish
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
}

export default function ApplicationsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Yuklanmoqda...</div>}>
            <ApplicationsContent />
        </Suspense>
    );
}