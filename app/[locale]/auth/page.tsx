'use client'
import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTokenStore } from '@/app/_store/useTokenStore'
import { useNotification } from '@/components/Notification'
import { useThemeStore } from '@/app/_store/useThemeStore'

export default function AuthPage() {
    const notify = useNotification()
    const token = useTokenStore(state => state.token)
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const setToken = useTokenStore(state => state.setToken)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [auth, setAuth] = useState('email')
    const router = useRouter()
    const params = useParams()
    const locale = params.locale || 'uz'

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const bodyData = auth === 'email' ? { email } : { 'email': email, 'code': String(code) };
        const postUrl = auth === 'email' ? `https://internet-magazin-nest-server.onrender.com/auth/send-otp` : `https://internet-magazin-nest-server.onrender.com/auth/verify-otp`;

        const res = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });
        const data = await res.json();

        if (res.ok) {
            if (auth === 'email') {
                setAuth('code');
                notify.show("Kod muvaffaqiyatli yuborildi!", "success", dark ? 'dark' : 'light')
            } else {
                setToken(data.token)
                router.push('/profile');
                notify.show("Akkaunt muaffaqiyatli ochildi!", "success", dark ? 'dark' : 'light')
            }
        } else {
            notify.show("Nimadir xato ketdi!", "error", dark ? 'dark' : 'light')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">

            <div className="relative z-10 w-full max-w-md p-8 rounded-[32px] bg-white/10 dark:bg-[#121214]/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-500">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/30 mb-4">
                        G
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {auth === 'email' ? 'Xush kelibsiz' : 'Kodni kiriting'}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {auth === 'email'
                            ? 'Davom etish uchun elektron pochtangizni kiriting'
                            : `${email} manziliga yuborilgan tasdiqlash kodini yozing`}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {auth === 'email' ? (
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 backdrop-blur-md transition-all"
                            />
                        ) : (
                            <input
                                type="text"
                                required
                                maxLength={6}
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-5 py-4 text-center tracking-widest text-2xl font-bold rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 backdrop-blur-md transition-all"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-90 active:scale-[0.98] shadow-lg shadow-sky-500/25 transition-all duration-200"
                    >
                        {auth === 'email' ? 'Kodni olish' : 'Tasdiqlash'}
                    </button>
                </form>
            </div>
        </div>
    )
}