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
import { Plus, Trash2, Image as ImageIcon, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    marketId: string;
    options: CategoryOption[];
    createdAt: string;
    [key: string]: unknown;
}

function CategoriesContent() {
    const notify = useNotification();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false);
    const token = useTokenStore((state) => state.token);
    const dark = useThemeStore((state) => state.theme) === "dark";
    const selectMarket = useSelectMarketStore((state) => state.selectMarket);
    const [categories, setCategories] = useState<Categorie[]>([]);

    const [categoryTitle, setCategoryTitle] = useState("");
    const [optionsList, setOptionsList] = useState<CategoryOption[]>([
        { title: "", items: [{ title: "", image: "" }] },
    ]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://internet-magazin-nest-server.onrender.com/categories");
            const req = await res.json();

            if (res.ok) {
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

    const handleAddOptionBlock = () => {
        setOptionsList([...optionsList, { title: "", items: [{ title: "", image: "" }] }]);
    };

    const handleRemoveOptionBlock = (index: number) => {
        setOptionsList(optionsList.filter((_, i) => i !== index));
    };

    const handleAddSubItem = (optionIndex: number) => {
        const updated = [...optionsList];
        updated[optionIndex].items.push({ title: "", image: "" });
        setOptionsList(updated);
    };

    const handleRemoveSubItem = (optionIndex: number, itemIndex: number) => {
        const updated = [...optionsList];
        updated[optionIndex].items = updated[optionIndex].items.filter((_, i) => i !== itemIndex);
        setOptionsList(updated);
    };

    const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("https://internet-magazin-nest-server.onrender.com/categories", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: categoryTitle,
                    options: optionsList,
                    marketId: selectMarket,
                }),
            });

            const req = await res.json();

            if (res.ok) {
                setIsOpen(false);
                notify.show("Yangi kategoriya muvaffaqiyatli qo'shildi", "success", dark ? "dark" : "light");
                setCategoryTitle("");
                setOptionsList([{ title: "", items: [{ title: "", image: "" }] }]);
                fetchData();
            } else {
                notify.show(req.message || "Nimadir xato ketdi", "error", dark ? "dark" : "light");
            }
        } catch (err) {
            notify.show("So'rov yuborilmadi", "error", dark ? "dark" : "light");
            console.log(err);
        }
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Categories</h1>
                    <p className="text-sm text-neutral-400 mt-1">Do'kon kategoriyalari va ularning filter optionlari</p>
                </div>

                <GlassButton onClick={() => setIsOpen(true)}>
                    <Plus className="w-4 h-4 mr-2 inline" /> Create Category
                </GlassButton>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500 text-lg">Yuklanmoqda...</div>
            ) : (
                <GlassTable
                    columns={[
                        { key: "title", label: "Kategoriya Nomi" },
                        { key: "createdAt", label: "Yaratilgan Vaqti" },
                    ]}
                    data={categories as Record<string, unknown>[]}
                    actions={(row) => {
                        const cat = row as unknown as Categorie;
                        return (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 overflow-x-auto max-w-[400px] py-1">
                                    {cat.options?.map((opt, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs flex flex-col gap-1 min-w-[120px]">
                                            <span className="font-bold text-sky-400">{opt.title}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                                                <span>{opt.items?.length || 0} ta element</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }}
                />
            )}

            <GlassModal size="2xl" overflow="visible" title="Create Category with Options" open={isOpen} onClose={() => setIsOpen(false)}>
                <form className="relative space-y-6 max-h-[75vh] w-full overflow-y-auto px-1 pb-20" onSubmit={handleCreateCategory}>
                    <GlassInput
                        label="Kategoriya Nomi"
                        placeholder="Masalan: Elektronika, Kiyim-kechak..."
                        value={categoryTitle}
                        onChange={(e) => setCategoryTitle(e.target.value)}
                        required
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-sky-400 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Options & SubItems (Xususiyatlar va rasmlar)
                            </label>
                            <GlassButton type="button" variant="outline" size="sm" onClick={handleAddOptionBlock}>
                                + Option qo'shish
                            </GlassButton>
                        </div>

                        {optionsList.map((opt, optIndex) => (
                            <motion.div
                                key={optIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-4 relative"
                            >
                                <div className="flex items-center gap-3">
                                    <GlassInput
                                        placeholder={`Option nomi (Masalan: Rangi, Razmeri)...`}
                                        value={opt.title}
                                        onChange={(e) => {
                                            const updated = [...optionsList];
                                            updated[optIndex].title = e.target.value;
                                            setOptionsList(updated);
                                        }}
                                        required
                                    />
                                    {optionsList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOptionBlock(optIndex)}
                                            className="p-3 bg-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/30 transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="pl-4 border-l-2 border-sky-500/30 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-400 font-medium">Ichki elementlar (Items):</span>
                                        <button
                                            type="button"
                                            onClick={() => handleAddSubItem(optIndex)}
                                            className="text-xs text-sky-400 hover:underline"
                                        >
                                            + Item qo'shish
                                        </button>
                                    </div>

                                    {opt.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    placeholder="Item nomi..."
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const updated = [...optionsList];
                                                        updated[optIndex].items[itemIndex].title = e.target.value;
                                                        setOptionsList(updated);
                                                    }}
                                                    className="w-full rounded-xl py-2 px-3 text-xs outline-none bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-sky-500"
                                                    required
                                                />
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    placeholder="Rasm havolasi (Image URL)..."
                                                    value={item.image}
                                                    onChange={(e) => {
                                                        const updated = [...optionsList];
                                                        updated[optIndex].items[itemIndex].image = e.target.value;
                                                        setOptionsList(updated);
                                                    }}
                                                    className="w-full rounded-xl py-2 px-3 text-xs outline-none bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-sky-500"
                                                    required
                                                />
                                            </div>
                                            {opt.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSubItem(optIndex, itemIndex)}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-4 backdrop-blur-md rounded-b-[28px] bg-neutral-900/60 border-t border-white/10 z-20">
                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Bekor qilish
                        </button>
                        <GlassButton type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                            Saqlash
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-white">Yuklanmoqda...</div>}>
            <CategoriesContent />
        </Suspense>
    );
}