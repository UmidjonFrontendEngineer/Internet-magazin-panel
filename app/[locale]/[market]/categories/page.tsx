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

function CategoriesContent() {
    const notify = useNotification();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

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

    const handleAddOptionBlock = () => {
        setOptionsList([...optionsList, { title: "", items: [{ title: "", image: "" }] }]);
    };

    const handleRemoveOptionBlock = (index: number) => {
        setOptionsList(optionsList.filter((_, i) => i !== index));
    };

    const handleItemChange = (optIndex: number, itemIndex: number, field: 'title' | 'image', value: string) => {
        const updated = [...optionsList];
        updated[optIndex].items[itemIndex][field] = value;

        const isLastItem = itemIndex === updated[optIndex].items.length - 1;
        const hasContent = updated[optIndex].items[itemIndex].title.trim() !== '' || updated[optIndex].items[itemIndex].image.trim() !== '';

        if (isLastItem && hasContent) {
            updated[optIndex].items.push({ title: "", image: "" });
        }

        setOptionsList(updated);
    };

    const handleRemoveSubItem = (optIndex: number, itemIndex: number) => {
        const updated = [...optionsList];
        updated[optIndex].items = updated[optIndex].items.filter((_, i) => i !== itemIndex);
        if (updated[optIndex].items.length === 0) {
            updated[optIndex].items.push({ title: "", image: "" });
        }
        setOptionsList(updated);
    };

    const handleImageUpload = (optIndex: number, itemIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleItemChange(optIndex, itemIndex, 'image', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const cleanedOptions = optionsList.map(opt => ({
            ...opt,
            items: opt.items.filter(item => item.title.trim() !== "" || item.image.trim() !== "")
        })).filter(opt => opt.title.trim() !== "" && opt.items.length > 0);

        try {
            const url = editId
                ? `https://internet-magazin-nest-server.onrender.com/categories/${editId}`
                : "https://internet-magazin-nest-server.onrender.com/categories";

            const method = editId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: categoryTitle,
                    options: cleanedOptions,
                    marketId: selectMarket,
                }),
            });

            const req = await res.json();

            if (res.ok) {
                setIsOpen(false);
                setEditId(null);
                notify.show(editId ? "Kategoriya yangilandi" : "Yangi kategoriya qo'shildi", "success", dark ? "dark" : "light");
                setCategoryTitle("");
                setOptionsList([{ title: "", items: [{ title: "", image: "" }] }]);
                fetchData();
            } else {
                notify.show(req.message || "Xatolik yuz berdi", "error", dark ? "dark" : "light");
            }
        } catch (err) {
            notify.show("Serverga ulanishda xatolik", "error", dark ? "dark" : "light");
            console.log(err);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`https://internet-magazin-nest-server.onrender.com/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                notify.show("Kategoriya o'chirildi", "success", dark ? "dark" : "light");
                fetchData();
            } else {
                notify.show("O'chirishda xatolik", "error", dark ? "dark" : "light");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpenEdit = (cat: Categorie) => {
        setEditId(cat.id);
        setCategoryTitle(cat.title);
        const formattedOptions = cat.options.map(opt => ({
            ...opt,
            items: [...opt.items, { title: "", image: "" }]
        }));
        setOptionsList(formattedOptions);
        setIsOpen(true);
    };

    const handleOpenCreate = () => {
        setEditId(null);
        setCategoryTitle("");
        setOptionsList([{ title: "", items: [{ title: "", image: "" }] }]);
        setIsOpen(true);
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Categories</h1>
                    <p className="text-sm text-neutral-400 mt-1">Do'kon kategoriyalari va ularning filter optionlari</p>
                </div>

                <GlassButton onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-2 inline" /> Create Category
                </GlassButton>
            </div>

            {loading ? (
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
                                            onClick={() => handleOpenEdit(cat)}
                                            className="p-2 bg-sky-500/10 text-sky-400 rounded-xl hover:bg-sky-500/20 transition"
                                            title="Tahrirlash"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
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
                                                            <div key={iIdx} className="flex items-center gap-2 bg-black/20 p-1.5 rounded-lg border border-white/5">
                                                                {item.image ? (
                                                                    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
                                                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-[10px]">Rasm yo'q</div>
                                                                )}
                                                                <span className="text-xs truncate text-neutral-200">{item.title}</span>
                                                            </div>
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
            )}

            <GlassModal size="2xl" overflow="visible" title={editId ? "Kategoriyani Tahrirlash" : "Create Category with Options"} open={isOpen} onClose={() => setIsOpen(false)}>
                <form className="space-y-4 max-h-[75vh] w-full overflow-y-auto px-1 pb-20" onSubmit={handleSubmitForm}>
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
                                <Layers className="w-4 h-4" /> Options & SubItems (Dinamik to'ldirish)
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
                                        placeholder="Option nomi (Masalan: Rangi, O'lchami)..."
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
                                    <span className="text-xs text-neutral-400 font-medium">Ichki elementlar (Item yozganingizda keyingisi ochiladi):</span>

                                    {opt.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    placeholder="Item nomi..."
                                                    value={item.title}
                                                    onChange={(e) => handleItemChange(optIndex, itemIndex, 'title', e.target.value)}
                                                    className="w-full rounded-xl py-2 px-3 text-xs outline-none bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-sky-500"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 flex-1">
                                                <label className="flex-1 cursor-pointer flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 hover:bg-white/10 transition text-neutral-300">
                                                    <span className="truncate">{item.image ? "Rasm tanlandi ✓" : "PC dan rasm tanlash"}</span>
                                                    <Upload className="w-3.5 h-3.5 text-sky-400 ml-1" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(optIndex, itemIndex, e)}
                                                    />
                                                </label>
                                                {item.image && (
                                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                                                        <Image src={item.image} alt="Preview" fill className="object-cover" />
                                                    </div>
                                                )}
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

                    <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
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
                            {editId ? "Yangilash" : "Saqlash"}
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