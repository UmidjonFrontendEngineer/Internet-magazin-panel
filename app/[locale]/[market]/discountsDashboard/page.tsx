"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassTable from "@/components/admin/GlassTable";
import GlassModal from "@/components/admin/GlassModal";
import GlassCard from "@/components/admin/GlassCard";
import GlassButton from "@/components/admin/GlassButton";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { useNotification } from "@/components/Notification";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";

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
    const queryId = searchParams.get("id") as string;
    const notify = useNotification()
    const [loading, setLoading] = useState<boolean>(true);
    const [imageModal, setImageModal] = useState(false)
    const token = useTokenStore(state => state.token)
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const selectMarket = useSelectMarketStore(state => state.selectMarket)
    const [discounts, setDiscounts] = useState<Discount[]>([])

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
    }, [queryId]);

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Discounts</h1>
                </div>
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
                                    O'chirish
                                </button>
                                <button
                                    // onClick={() => setMessageModal(user.email)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                >
                                    Xabar
                                </button>
                                <button
                                    // onClick={() => { setRateModal(true); setSelectEmail(user.email) }}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                >
                                    Baholash
                                </button>
                            </div>
                        );
                    }}
                />
            )}
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