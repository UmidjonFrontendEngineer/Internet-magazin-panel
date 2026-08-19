"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassTable from "@/components/admin/GlassTable";
import GlassModal from "@/components/admin/GlassModal";
import GlassButton from "@/components/admin/GlassButton";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { useNotification } from "@/components/Notification";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";
import GlassInput from "@/components/admin/GlassInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Edit3, Trash2, Plus, Calendar, MousePointerClick } from "lucide-react";

interface Discount {
    id: string;
    title: string;
    percentage: number;
    startDate: string;
    endDate: string;
    market: string;
    [key: string]: unknown;
}

function DiscountContent({ setDiscountId }: { setDiscountId: React.Dispatch<React.SetStateAction<string>> }) {
    const [loading, setLoading] = useState<boolean>(true);

    const dark = useThemeStore((state) => state.theme) === "dark";
    const selectMarket = useSelectMarketStore((state) => state.selectMarket);

    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://internet-magazin-nest-server.onrender.com/discounts");
            const req = await res.json();

            if (res.ok && Array.isArray(req)) {
                const filteredData = req.filter((item: Discount) => item.market === selectMarket);
                setDiscounts(filteredData);
            }
        } catch (err) {
            console.error("Xatolik:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectMarket]);

    return (
        loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading...</div>
        ) : discounts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-base bg-white/5 rounded-2xl border border-white/10">
                Bu market uchun chegirmalar topilmadi.
            </div>
        ) : (
            <GlassTable
                columns={[
                    { key: "title", label: "Chegirma Nomi" },
                    { key: "percentage", label: "Foiz (%)" },
                    { key: "startDate", label: "Boshlanish Vaqti" },
                    { key: "endDate", label: "Tugash Vaqti" },
                ]}
                data={discounts.map((disc) => ({
                    ...disc,
                    percentage: `-${disc.percentage}%`,
                    startDate: disc.startDate ? new Date(disc.startDate).toLocaleString() : "-",
                    endDate: disc.endDate ? new Date(disc.endDate).toLocaleString() : "-",
                })) as Record<string, unknown>[]}
                actions={(row) => {
                    const disc = row as unknown as Discount;
                    const originalDisc = discounts.find(d => d.title === disc.title && d.market === selectMarket) || disc;

                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDiscountId(originalDisc.id)}
                                className="p-2 bg-sky-500/10 text-sky-400 rounded-xl hover:bg-sky-500/20 transition"
                                title="Select"
                            >
                                <MousePointerClick className="w-4 h-4" />
                            </button>
                        </div>
                    );
                }}
            />
        )
    );
}

export default function ApplicationsPage({ setDiscountId }: { setDiscountId: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-white">Loading...</div>}>
            <DiscountContent setDiscountId={setDiscountId} />
        </Suspense>
    );
}