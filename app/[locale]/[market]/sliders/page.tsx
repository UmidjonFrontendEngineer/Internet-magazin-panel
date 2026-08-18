"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassTable from "@/components/admin/GlassTable";
import GlassModal from "@/components/admin/GlassModal";
import GlassButton from "@/components/admin/GlassButton";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { useNotification } from "@/components/Notification";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";
import GlassInput from "@/components/admin/GlassInput";
import { Edit3, Trash2, Plus, Image as ImageIcon, ExternalLink } from "lucide-react";

interface Slider {
    id: string;
    imageUrl: string;
    redirectUrl: string;
    market: string;
    [key: string]: unknown;
}

function SlidersContent() {
    const notify = useNotification();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<string | null>(null);

    const token = useTokenStore((state) => state.token);
    const dark = useThemeStore((state) => state.theme) === "dark";
    const selectMarket = useSelectMarketStore((state) => state.selectMarket);

    const [sliders, setSliders] = useState<Slider[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [redirectUrl, setRedirectUrl] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://internet-magazin-nest-server.onrender.com/sliders");
            const req = await res.json();

            if (res.ok && Array.isArray(req)) {
                const filteredData = req.filter((item: Slider) => item.market === selectMarket);
                setSliders(filteredData);
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

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = editId
                ? `https://internet-magazin-nest-server.onrender.com/sliders/${editId}`
                : "https://internet-magazin-nest-server.onrender.com/sliders";

            const method = editId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl,
                    redirectUrl,
                    market: selectMarket,
                }),
            });

            const req = await res.json();

            if (res.ok) {
                setIsOpen(false);
                setEditId(null);
                notify.show(
                    editId ? "Slider muvaffaqiyatli yangilandi" : "Yangi slider muvaffaqiyatli qo'shildi",
                    "success",
                    dark ? "dark" : "light"
                );
                resetForm();
                fetchData();
            } else {
                notify.show(req.message || "Nimadir xato ketdi", "error", dark ? "dark" : "light");
            }
        } catch (err) {
            notify.show("Serverga ulanishda xatolik", "error", dark ? "dark" : "light");
            console.log(err);
        }
    };

    const handleDeleteSlider = async (id: string) => {
        try {
            const res = await fetch(`https://internet-magazin-nest-server.onrender.com/sliders/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                notify.show("Slider o'chirildi", "success", dark ? "dark" : "light");
                fetchData();
            } else {
                notify.show("O'chirishda xatolik yuz berdi", "error", dark ? "dark" : "light");
            }
        } catch (err) {
            console.log(err);
            notify.show("Serverda xatolik", "error", dark ? "dark" : "light");
        }
    };

    const handleOpenEdit = (slider: Slider) => {
        setEditId(slider.id);
        setImageUrl(slider.imageUrl);
        setRedirectUrl(slider.redirectUrl);
        setIsOpen(true);
    };

    const handleOpenCreate = () => {
        setEditId(null);
        resetForm();
        setIsOpen(true);
    };

    const resetForm = () => {
        setImageUrl("");
        setRedirectUrl("");
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Sliders (Bannerlar)</h1>
                    <p className="text-sm text-neutral-400 mt-1">Do'kon uchun reklama bannerlarini boshqarish</p>
                </div>

                <GlassButton onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-2 inline" /> Create Slider
                </GlassButton>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500 text-lg">Yuklanmoqda...</div>
            ) : sliders.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-base bg-white/5 rounded-2xl border border-white/10">
                    Bu market uchun sliderlar topilmadi.
                </div>
            ) : (
                <GlassTable
                    columns={[
                        { key: "preview", label: "Rasm" },
                        { key: "redirectUrl", label: "O'tish manzili (Link)" },
                    ]}
                    data={sliders.map((slider) => ({
                        ...slider,
                        preview: (
                            <img
                                src={slider.imageUrl}
                                alt="Slider"
                                className="w-24 h-12 object-cover rounded-lg border border-white/10"
                            />
                        ),
                        redirectUrl: (
                            <a
                                href={slider.redirectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-400 hover:underline flex items-center gap-1"
                            >
                                {slider.redirectUrl} <ExternalLink className="w-3 h-3" />
                            </a>
                        )
                    })) as Record<string, unknown>[]}
                    actions={(row) => {
                        const slider = row as unknown as Slider;
                        const originalSlider = sliders.find(s => s.id === slider.id) || slider;

                        return (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenEdit(originalSlider as Slider)}
                                    className="p-2 bg-sky-500/10 text-sky-400 rounded-xl hover:bg-sky-500/20 transition"
                                    title="Tahrirlash"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteModal(originalSlider.id)}
                                    className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition"
                                    title="O'chirish"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    }}
                />
            )}

            <GlassModal
                title={editId ? "Sliderni Tahrirlash" : "Create Slider"}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <form className="space-y-4 w-full pb-4" onSubmit={handleSubmitForm}>
                    <GlassInput
                        label="Rasm havolasi (Image URL)"
                        placeholder="https://example.com/image.jpg..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                    <GlassInput
                        label="Yo'naltirish havolasi (Redirect URL)"
                        placeholder="https://example.com/category/... yoki mahsulot linki"
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                        required
                    />

                    {imageUrl && (
                        <div className="space-y-1.5">
                            <label className="text-xs text-neutral-400 font-medium">Ko'rinishi (Preview)</label>
                            <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-black/20 flex items-center justify-center">
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Bekor qilish
                        </button>
                        <GlassButton
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                        >
                            {editId ? "Yangilash" : "Saqlash"}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>

            <GlassModal title="Delete slider" open={!!deleteModal} onClose={() => setDeleteModal(null)}>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Haqiqatan ham bu sliderni o'chirib yubormoqchimisiz?</p>

                    <div className="p-6"></div>

                    <div className="flex items-center justify-end gap-3 pt-6">
                        <button
                            onClick={() => setDeleteModal(null)}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (deleteModal) {
                                    handleDeleteSlider(deleteModal);
                                    setDeleteModal(null);
                                }
                            }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </GlassModal>
        </div>
    );
}

export default function SlidersPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-white">Yuklanmoqda...</div>}>
            <Suspense fallback={null}>
                <SlidersContent />
            </Suspense>
        </Suspense>
    );
}