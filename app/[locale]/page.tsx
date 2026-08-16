'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useTokenStore } from '@/app/_store/useTokenStore'
import GlassModal from '@/components/admin/GlassModal'
import GlassInput from '@/components/admin/GlassInput'
import GlassButton from '@/components/admin/GlassButton'
import GlassCard from '@/components/admin/GlassCard'
import { useThemeStore } from '@/app/_store/useThemeStore'
import { useSelectMarketStore } from '@/app/_store/useSelectMarketStore'
import Map from '@/app/_components/Map'
import { useNotification } from '@/components/Notification'

interface Market {
    id: string
    title: string
    logo: string
}

interface Worker {
    id: string
    title: string
    logo: string
    role: string
}

export default function ProfilePage() {
    const notify = useNotification()
    const token = useTokenStore(state => state.token)
    const setToken = useTokenStore(state => state.setToken)
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const router = useRouter()
    const params = useParams()
    const locale = params.locale || 'uz'
    const [firstName, setFirstName] = useState('firstName')
    const [lastName, setLastName] = useState('lastName')
    const [email, setEmail] = useState('example@gmail.com')
    const [workers, setWorkers] = useState<Worker[]>([])
    const [image, setImage] = useState('https://i.ibb.co/nNZrjBSD/user.png')
    const [marketAdd, setMarketAdd] = useState(false)
    const [deleteAkkModalOpen, setDeleteAkkModalOpen] = useState(false)
    const selectMarket = useSelectMarketStore(state => state.selectMarket)
    const [openMap, setOpenMap] = useState(false)
    const setSelectMarket = useSelectMarketStore(state => state.setSelectMarket)
    const [mapLat, setMapLat] = useState(0)
    const [mapLng, setMapLng] = useState(0)

    useEffect(() => {
        if (marketAdd === false) {
            setMapLat(0)
            setMapLng(0)
        }
    }, [marketAdd])

    const getWorkers = async () => {
        try {
            const res = await fetch('https://internet-magazin-nest-server.onrender.com/workers/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const req = await res.json()

            if (res.ok) {
                console.log(req)
                setWorkers(req)
            } else {
                console.log(req.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const renderToken = async (token: string) => {
        console.log("Yuborilayotgan token:", token);
        if (!token) {
            console.error("Token mavjud emas!");
            return;
        }
        try {
            const res = await fetch(`https://internet-magazin-nest-server.onrender.com/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                notify.show("Hisobingizga kiring!", "error", dark ? 'dark' : 'light')
                const errorText = await res.text();
                console.log("Server xatosi:", errorText);
                router.push('/auth')
                return;
            }

            const req = await res.json();
            console.log(req);
            setFirstName(req.firstName);
            setLastName(req.lastName);
            setEmail(req.email);
            setImage(req.image);
        } catch (err) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.log("Fetch xatosi:", err);
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`https://internet-magazin-nest-server.onrender.com/auth/account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setToken('')
                notify.show("Akkaunt muaffaqiaytli o'chirldi", "success", dark ? 'dark' : 'light')

                window.location.href = '/auth';
            } else {
            }
        } catch (error) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.error('Server bilan aloqada xatolik:', error);
        }
    };

    const [markets, setMarkets] = useState<Market[]>([])
    const handleGetMarkets = async (token: string) => {
        try {
            const response = await fetch(`https://internet-magazin-nest-server.onrender.com/markets/get`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setMarkets(data)
            } else {
                notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            }
        } catch (error) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.error('Server bilan aloqada xatolik:', error);
        }
    }

    const handleCreateMarket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(mapLat, mapLng)
        const formData = new FormData(e.currentTarget);
        formData.append('lat', mapLat.toString());
        formData.append('lng', mapLng.toString());
        const title = formData.get('title');
        const logo = formData.get('logo');

        if (title === '') {
            notify.show("Market nomini kiriting", "error", dark ? 'dark' : 'light')
            return
        }
        if (!logo || (logo instanceof File && logo.size === 0) || logo.toString().trim() === '') {
            notify.show("Market logosini kiriting", "error", dark ? 'dark' : 'light');
            return;
        }
        if (mapLat === 0 || mapLng === 0) {
            notify.show("Market kordinatasini xaritadan belgilang", "error", dark ? 'dark' : 'light')
            return
        }
        setMarketAdd(false)

        try {
            const response = await fetch('https://internet-magazin-nest-server.onrender.com/markets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Do\'kon muvaffaqiyatli ochildi:', data);
                notify.show("Market muvaffaqiyatli ochildi!", "success", dark ? 'dark' : 'light')
                handleGetMarkets(token);
            } else {
                console.error('Xatolik yuz berdi:', data);
            }
        } catch (error) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.error('Server bilan aloqada xatolik:', error);
        }
    };

    const handleDeleteMarket = async (marketId: string) => {
        try {
            const response = await fetch(`https://internet-magazin-nest-server.onrender.com/markets/${marketId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                notify.show("Market muvaffaqiyatli o'chirildi!", "success", dark ? 'dark' : 'light')
                console.log('O\'chirildi:', data);
                handleGetMarkets(token);
            } else {
                console.error('O\'chirishda xatolik:', data);
            }
        } catch (error) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.error('Server bilan aloqada xatolik:', error);
        }
    };

    useEffect(() => {
        if (!token) return
        renderToken(token)
        handleGetMarkets(token)
    }, [token])

    useEffect(() => {
        getWorkers()
    })

    const [selectedMarket, setSelectedMarket] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const handleLogout = () => {
        setToken('')
        router.push(`/${locale}/auth`)
    }

    const handleMarketClick = (marketTitle: string) => {
        router.push(`/${locale}/${encodeURIComponent(marketTitle.replaceAll(' ', '_'))}/dashboard`)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className={`p-8 rounded-[32px] ${dark ? 'bg-[#121214]/40 border-white/10' : 'bg-white/10 border-white/20'} backdrop-blur-3xl border shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col md:flex-row items-center justify-between gap-6`}>
                <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-sky-500/50 shadow-lg">
                        <Image
                            src={image}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-neutral-900'}`}>{firstName}</h2>
                        <p className={`text-sm ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>{email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLogout}
                        className={`px-5 py-2.5 rounded-xl font-medium ${dark ? 'text-neutral-300' : 'text-neutral-700'} text-sm bg-neutral-500/10 hover:bg-neutral-500/20 transition-all`}
                    >
                        Log out
                    </button>
                    <button
                        onClick={() => setDeleteAkkModalOpen(true)}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm ${dark ? 'text-red-400' : 'text-red-600'} bg-red-500/10 hover:bg-red-500/20 transition-all`}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className={`text-lg ${dark ? 'text-white' : 'text-neutral-900'} font-bold tracking-wide uppercase`}>
                        Mening marketlarim
                    </h3>
                    <GlassButton
                        onClick={() => setMarketAdd(true)}
                    >
                        add
                    </GlassButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {markets.map((market) => (
                        <GlassCard hover={true} className='!p-0 flex items-center justify-between group' key={market.id}>
                            <GlassButton
                                variant='ghost'
                                onClick={() => { setSelectMarket(market.id); handleMarketClick(market.id); }}
                                className="flex items-center rounded-3xl gap-4 cursor-pointer flex-col flex-1"
                            >
                                <Image src={market.logo} alt={market.title} width={40000} height={40000} className="object-cover rounded-2xl" />
                                <div className={`font-semibold ${dark ? 'text-white' : 'text-neutral-900'} flex items-center justify-between w-full group-hover:text-sky-500 transition-colors`}>
                                    <h1 className='text-start'>{market.title}</h1>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedMarket(market.id); setIsEditModalOpen(true); }}
                                            className={`p-2 rounded-2xl ${dark ? 'bg-white/5 text-neutral-300' : 'bg-black/5 text-neutral-600'} hover:bg-sky-500/20 hover:text-sky-500 transition-all`}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedMarket(market.id); setIsDeleteModalOpen(true); }}
                                            className={`p-2 rounded-2xl ${dark ? 'bg-white/5 text-neutral-300' : 'bg-black/5 text-neutral-600'} hover:bg-red-500/20 hover:text-red-500 transition-all`}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </GlassButton>
                        </GlassCard>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <h3 className={`text-lg ${dark ? 'text-white' : 'text-neutral-900'} font-bold tracking-wide uppercase`}>
                        Mening ishlarim
                    </h3>
                    <GlassButton
                        onClick={() => router.push('/vacancy/vacancy')}
                    >
                        Ishlar qo'shish
                    </GlassButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workers.map((worker) => (
                        <GlassCard hover={true} className='!p-0 flex items-center justify-between group' key={worker.id}>
                            <GlassButton
                                variant='ghost'
                                onClick={() => { setSelectMarket(worker.id); handleMarketClick(worker.id); }}
                                className="flex relative items-center rounded-3xl p-0 gap-4 cursor-pointer flex-col flex-1"
                            >
                                <div className="absolute top-0 left-0 w-full flex items-center p-2 justify-end rounded-full">
                                    <div className='p-1 rounded-full bg-white/5 backdrop-blur-sm'>{worker.role}</div>
                                </div>
                                <Image src={worker.logo} alt={worker.title} width={40000} height={40000} className="object-cover rounded-2xl" />
                                <h1 className={`font-semibold ${dark ? 'text-white' : 'text-neutral-900'} text-start w-full group-hover:text-sky-500 transition-colors`}>
                                    {worker.title}
                                </h1>
                            </GlassButton>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <GlassModal title="Market ochish" onClose={() => setMarketAdd(false)} open={marketAdd}>
                <form onSubmit={handleCreateMarket} className="space-y-4">

                    <p className="text-zinc-400 text-sm">
                        Yangi market ochish uchun uning nomini kiriting rasmini yuklang va kordinatasini belgilang.
                    </p>

                    <div className="flex flex-col w-full gap-4">
                        <GlassInput
                            name='title'
                            type='text'
                            maxLength={26}
                            placeholder="Market nomini yozing"
                            onChange={(e) => {
                                let value = e.target.value;

                                value = value.replaceAll('_', '');

                                value = value.replace(/ {2,}/g, ' ');

                                if (e.target.value !== value) {
                                    e.target.value = value;
                                }
                            }}
                        />
                        <GlassInput name='logo' type='file' />
                    </div>

                    <GlassButton type='button' className='w-full' onClick={() => setOpenMap(true)}>xaritadan belgilash</GlassButton>

                    <div className="p-6"></div>

                    <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                        <button
                            onClick={() => setMarketAdd(false)}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Bekor qilish
                        </button>
                        <GlassButton
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                        >
                            Yuborish
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>

            <GlassModal title="Akkauntni o'chirish" onClose={() => setDeleteAkkModalOpen(false)} open={deleteAkkModalOpen}>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Haqiqatan ham akkauntingizni o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>

                    <div className="p-6"></div>

                    <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                        <button
                            onClick={() => setDeleteAkkModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => {
                                handleDeleteAccount()
                                setDeleteAkkModalOpen(false)
                            }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Akkauntni o'chirish
                        </button>
                    </div>
                </div>
            </GlassModal>

            <GlassModal size='full' open={openMap} onClose={() => setOpenMap(false)} title='Xaritadan belgilang'>
                <Map
                    isDarkMode={dark}
                    onLocationSelect={(lat, lng) => {
                        console.log("Tanlangan koordinatalar:", lat, lng);
                        setMapLat(lat)
                        setMapLng(lng)
                    }} />

                <GlassButton
                    onClick={() => setOpenMap(false)}
                    className={`w-full mt-4 ${mapLng === 0 || mapLat === 0 ? '!bg-gray-200 !text-gray-400 cursor-not-allowed' : ''}`}
                    disabled={mapLng === 0 || mapLat === 0}
                >
                    Tanlandi
                </GlassButton>
            </GlassModal>

            <GlassModal title="Marketni o'chirish" onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen}>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Haqiqatan ham bu marketni o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>

                    <div className="p-6"></div>

                    <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => {
                                handleDeleteMarket(selectedMarket)
                                setIsDeleteModalOpen(false)
                            }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                        >
                            O'chirish
                        </button>
                    </div>
                </div>
            </GlassModal>
        </div>
    )
}