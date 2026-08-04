'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

interface UserItem {
    id: string
    firstName: string
    lastName: string
    email: string
    profileImage: string
    role: string
}

export default function WarehouseUsersPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale || 'uz'

    const [users, setUsers] = useState<UserItem[]>([
        { id: '1', firstName: 'Umidjon', lastName: 'Frontend', email: 'umidjon@gmail.com', profileImage: 'https://i.ibb.co/nNZrjBSD/user.png', role: 'Superadmin' },
        { id: '2', firstName: 'Jasur', lastName: 'Karimov', email: 'jasur@gmail.com', profileImage: 'https://i.ibb.co/nNZrjBSD/user.png', role: 'Mijoz' },
        { id: '3', firstName: 'Malika', lastName: 'Aliyeva', email: 'malika@gmail.com', profileImage: 'https://i.ibb.co/nNZrjBSD/user.png', role: 'Mijoz' },
    ])

    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDelete = (id: string) => {
        setUsers(users.filter(u => u.id !== id))
        setDeleteId(null)
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 relative min-h-[80vh] animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Do'kon Foydalanuvchilari (Users)
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Tizimdagi barcha ro'yxatdan o'tgan foydalanuvchilar va ularning ma'lumotlari
                    </p>
                </div>
                <button
                    onClick={() => router.push(`/${locale}/warehouse/products`)}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-all"
                >
                    &larr; Mahsulotlarga qaytish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="p-6 rounded-[28px] bg-white/10 dark:bg-[#121214]/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-500/40 transition-all duration-300 group flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black/10 border border-white/10 shrink-0">
                                <Image
                                    src={user.profileImage}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-neutral-900 dark:text-white text-base truncate">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                    {user.email}
                                </p>
                                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-500 text-[10px] font-semibold border border-sky-500/20">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setDeleteId(user.id)}
                                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium text-sm transition-all active:scale-95 border border-red-500/20 flex items-center justify-center gap-2"
                            >
                                <span>🗑️ O'chirish (Delete)</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-sm p-6 rounded-3xl bg-[#121214] border border-white/10 shadow-2xl space-y-4">
                        <h4 className="text-lg font-bold text-white">Foydalanuvchini o'chirish</h4>
                        <p className="text-sm text-neutral-400">Rostdan ham ushbu foydalanuvchini tizimdan butunlay o'chirib tashlamoqchimisiz?</p>
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