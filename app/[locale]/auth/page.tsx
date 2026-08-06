'use client'
import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTokenStore } from '@/app/_store/useTokenStore'
import { useNotification } from '@/components/Notification'
import { useThemeStore } from '@/app/_store/useThemeStore'
import GlassInput from '@/components/admin/GlassInput'
import GlassModal from '@/components/admin/GlassModal'

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
        if (auth === 'email') {
            if (!email) {
                notify.show("Email ni kiriting!", "error", dark ? 'dark' : 'light')
                return
            }
        } else {
            if (!code) {
                notify.show("Code ni kiriting!", "error", dark ? 'dark' : 'light')
                return
            }
        }
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
        <GlassModal open={true} title="Ro'yxatdan o'tish" onClose={() => router.back()} size='3xl'>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    {auth === 'email' ? (
                        <GlassInput
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        <GlassInput
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className='text-center'
                        />
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => router.back()}
                        type="button"
                        className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
                    >
                        {auth === 'email' ? 'Kodni olish' : 'Tasdiqlash'}
                    </button>
                </div>
            </form>
        </GlassModal>
    )
}