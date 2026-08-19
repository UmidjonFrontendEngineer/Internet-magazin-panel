"use client";

import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassTable from "@/components/admin/GlassTable";
import GlassModal from "@/components/admin/GlassModal";
import GlassButton from "@/components/admin/GlassButton";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { useNotification } from "@/components/Notification";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";
import GlassInput from "@/components/admin/GlassInput";
import { Plus, Trash2, Edit3, Layers, Upload, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface SubItem {
    title: string;
    image: string;
}

interface CategoryOption {
    title: string;
    items: SubItem[];
}

interface Categorie {
    id: string;
    title: string;
    marketId?: string;
    marketid?: string;
    options: CategoryOption[];
    createdAt: string;
    [key: string]: unknown;
}

function CategoriesContent({ setCategoryId }: { setCategoryId: React.Dispatch<React.SetStateAction<string>> }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const token = useTokenStore((state) => state.token);
    const dark = useThemeStore((state) => state.theme) === "dark";
    const selectMarket = useSelectMarketStore((state) => state.selectMarket);
    const [categories, setCategories] = useState<Categorie[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://internet-magazin-nest-server.onrender.com/categories");
            const req = await res.json();

            if (res.ok && Array.isArray(req)) {
                const filteredData = req.filter((item: Categorie) => {
                    const mId = item.marketId || item.marketid;
                    return mId === selectMarket;
                });
                setCategories(filteredData);
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
            <div className="text-center py-12 text-gray-500 text-lg">Yuklanmoqda...</div>
        ) : categories.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-base bg-white/5 rounded-2xl border border-white/10">
                Bu market uchun kategoriyalar topilmadi.
            </div>
        ) : (
            <GlassTable
                columns={[
                    { key: "title", label: "Kategoriya Nomi" },
                    { key: "createdAt", label: "Yaratilgan Vaqti" },
                ]}
                data={categories.map(cat => ({
                    ...cat,
                    createdAt: new Date(cat.createdAt).toLocaleString()
                })) as Record<string, unknown>[]}
                actions={(row) => {
                    const cat = row as unknown as Categorie;
                    const isExpanded = expandedRow === cat.id;

                    return (
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => setExpandedRow(isExpanded ? null : cat.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border transition",
                                        dark ? "bg-white/5 border-white/10 hover:bg-white/10 text-sky-400" : "bg-sky-50 border-sky-200 text-sky-600"
                                    )}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>{cat.options?.length || 0} ta Option</span>
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition"
                                        title="O'chirish"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden space-y-2 pt-2 border-t border-white/10"
                                    >
                                        {cat.options?.map((opt, idx) => (
                                            <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                                                <span className="font-bold text-xs text-sky-400">{opt.title}</span>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {opt.items?.map((item, iIdx) => (
                                                        <button onClick={() => setCategoryId(item.title)} key={iIdx} className="flex items-center gap-2 bg-black/20 p-1.5 rounded-lg border border-white/5">
                                                            {item.image ? (
                                                                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
                                                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-[10px]">Rasm yo'q</div>
                                                            )}
                                                            <span className="text-xs truncate text-neutral-200">{item.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                }}
            />
        )
    );
}

export default function CategoriesPage({ setCategoryId }: { setCategoryId: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-white">Yuklanmoqda...</div>}>
            <CategoriesContent setCategoryId={setCategoryId} />
        </Suspense>
    );
}