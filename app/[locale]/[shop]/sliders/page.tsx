'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

interface SliderItem {
    id: string
    imageUrl: string
    link: string
}

export default function SlidersPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale || 'uz'

    const [sliders, setSliders] = useState<SliderItem[]>([
        { id: '1', imageUrl: 'https://i.ibb.co/nNZrjBSD/user.png', link: '/products/1' },
        { id: '2', imageUrl: 'https://i.ibb.co/nNZrjBSD/user.png', link: '/products/2' },
    ])

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentSlider, setCurrentSlider] = useState<SliderItem | null>(null)
    
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [imageUrl, setImageUrl] = useState('')
    const [link, setLink] = useState('')

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (imageUrl && link) {
            setSliders([...sliders, { id: Date.now().toString(), imageUrl, link }])
            setImageUrl('')
            setLink('')
            setIsCreateOpen(false)
        }
    }

    const openEditModal = (slider: SliderItem) => {
        setCurrentSlider(slider)
        setImageUrl(slider.imageUrl)
        setLink(slider.link)
        setIsEditOpen(true)
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentSlider && imageUrl && link) {
            setSliders(sliders.map(s => s.id === currentSlider.id ? { ...s, imageUrl, link } : s))
            setIsEditOpen(false)
            setCurrentSlider(null)
            setImageUrl('')
            setLink('')
        }
    }

    const handleDelete = (id: string) => {
        setSliders(sliders.filter(s => s.id !== id))
        setDeleteId(null)
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 relative min-h-[80vh] animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Banner Slayderlar Boshqaruvi
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Do'kon bosh sahifasida ko'rinadigan reklamalar va slayderlar
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {sliders.map((slider) => (
                    <div
                        key={slider.id}
                        className="p-5 rounded-[28px] bg-white/10 dark:bg-[#121214]/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-500/40 transition-all duration-300 group flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/10">
                                <Image src={slider.imageUrl} alt="Slider" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div>
                                <span className="text-xs uppercase font-semibold text-neutral-400">O'tish havolasi:</span>
                                <p className="text-sm font-medium text-sky-500 truncate">{slider.link}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4">
                            <button
                                onClick={() => openEditModal(slider)}
                                className="flex-1 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 font-medium text-sm transition-all active:scale-95 border border-sky-500/20"
                            >
                                Tahrirlash (Edit)
                            </button>
                            <button
                                onClick={() => setDeleteId(slider.id)}
                                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 border border-red-500/20"
                                title="O'chirish"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    setImageUrl('')
                    setLink('')
                    setIsCreateOpen(true)
                }}
                className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xl shadow-sky-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/30"
                title="Yangi slayder qo'shish"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-6 rounded-[32px] bg-[#121214] border border-white/10 shadow-2xl space-y-4">
                        <h3 className="text-xl font-bold text-white">Yangi Slayder Qo'shish</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">Rasm havolasi (URL)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://image.url/photo.png"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">Havola (Link)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="/products/category"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30"
                                >
                                    Qo'shish (Post)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-6 rounded-[32px] bg-[#121214] border border-white/10 shadow-2xl space-y-4">
                        <h3 className="text-xl font-bold text-white">Slayderni Tahrirlash (Put)</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">Rasm havolasi (URL)</label>
                                <input
                                    type="text"
                                    required
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">Havola (Link)</label>
                                <input
                                    type="text"
                                    required
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30"
                                >
                                    Saqlash (Put)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-sm p-6 rounded-3xl bg-[#121214] border border-white/10 shadow-2xl space-y-4">
                        <h4 className="text-lg font-bold text-white">Slayderni o'chirish</h4>
                        <p className="text-sm text-neutral-400">Rostdan ham ushbu slayder bannerini o'chirib tashlamoqchimisiz?</p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/30"
                            >
                                O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}