'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

interface Product {
    id: string
    title: string
    price: number
    quantity: number
    image: string
}

export default function WarehouseProductsPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale || 'uz'

    const [products, setProducts] = useState<Product[]>([
        { id: '1', title: 'iPhone 15 Pro Max', price: 1200, quantity: 15, image: 'https://i.ibb.co/nNZrjBSD/user.png' },
        { id: '2', title: 'MacBook Pro M3', price: 2100, quantity: 8, image: 'https://i.ibb.co/nNZrjBSD/user.png' },
        { id: '3', title: 'AirPods Pro 2', price: 250, quantity: 40, image: 'https://i.ibb.co/nNZrjBSD/user.png' },
    ])

    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDelete = (id: string) => {
        setProducts(products.filter(p => p.id !== id))
        setDeleteId(null)
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 relative min-h-[80vh] animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Ombor Mahsulotlari
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Barcha mahsulotlarni kuzatish, tahrirlash va boshqarish oynasi
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="p-5 rounded-[28px] bg-white/10 dark:bg-[#121214]/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-500/40 transition-all duration-300 group flex flex-col justify-between"
                    >
                        <div>
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-black/10 mb-4">
                                <Image 
                                    src={product.image} 
                                    alt={product.title} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                                    {product.quantity} dona
                                </div>
                            </div>

                            <h3 className="font-bold text-neutral-900 dark:text-white text-lg mb-1 truncate">
                                {product.title}
                            </h3>
                            <p className="text-sky-500 font-semibold text-sm mb-4">
                                ${product.price}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={() => router.push(`/${locale}/warehouse/products/edit?id=${product.id}`)}
                                className="flex-1 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 font-medium text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border border-sky-500/20"
                            >
                                <span>Tahrirlash (Edit)</span>
                            </button>
                            <button
                                onClick={() => setDeleteId(product.id)}
                                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 border border-red-500/20"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => router.push(`/${locale}/warehouse/products/create`)}
                className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-2xl shadow-sky-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/30"
                title="Yangi mahsulot qo'shish"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-sm p-6 rounded-3xl bg-[#121214] border border-white/10 shadow-2xl space-y-4">
                        <h4 className="text-lg font-bold text-white">Mahsulotni o'chirish</h4>
                        <p className="text-sm text-neutral-400">Rostdan ham ushbu mahsulotni ombordan o'chirib tashlamoqchimisiz?</p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-all"
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