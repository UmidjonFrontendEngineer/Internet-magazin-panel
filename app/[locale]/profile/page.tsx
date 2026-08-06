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
import { useSelectShopStore } from '@/app/_store/useSelectShopStore'
import Map from '@/app/_components/Map'
import { useNotification } from '@/components/Notification'

interface Shop {
    id: string
    title: string
    logo: string
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
    const [image, setImage] = useState('https://i.ibb.co/nNZrjBSD/user.png')
    const [shopAdd, setShopAdd] = useState(false)
    const [deleteAkkModalOpen, setDeleteAkkModalOpen] = useState(false)
    const selectShop = useSelectShopStore(state => state.selectShop)
    const [openMap, setOpenMap] = useState(false)
    const setSelectShop = useSelectShopStore(state => state.setSelectShop)
    const [mapLat, setMapLat] = useState(0)
    const [mapLng, setMapLng] = useState(0)

    useEffect(() => {
        if (shopAdd === false) {
            setMapLat(0)
            setMapLng(0)
        }
    }, [shopAdd])

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

    const [shops, setShops] = useState<Shop[]>([])
    const handleGetShops = async (token: string) => {
        try {
            const response = await fetch(`https://internet-magazin-nest-server.onrender.com/shops/get`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setShops(data)
            } else {
                notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            }
        } catch (error) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.error('Server bilan aloqada xatolik:', error);
        }
    }

    const handleCreateShop = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(mapLat, mapLng)
        const formData = new FormData(e.currentTarget);
        formData.append('lat', mapLat.toString());
        formData.append('lng', mapLng.toString());
        const title = formData.get('title');
        const logo = formData.get('logo');

        if (title === '') {
            notify.show("Do'kon nomini kiriting", "error", dark ? 'dark' : 'light')
            return
        }
        if (!logo || (logo instanceof File && logo.size === 0) || logo.toString().trim() === '') {
            notify.show("Do'kon logosini kiriting", "error", dark ? 'dark' : 'light');
            return;
        }
        if (mapLat === 0 || mapLng === 0) {
            notify.show("Do'kon kordinatasini xaritadan belgilang", "error", dark ? 'dark' : 'light')
            return
        }
        setShopAdd(false)

        try {
            const response = await fetch('https://internet-magazin-nest-server.onrender.com/shops', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Do\'kon muvaffaqiyatli ochildi:', data);
                notify.show("Do'kon muvaffaqiyatli ochildi!", "success", dark ? 'dark' : 'light')
                handleGetShops(token);
            } else {
                console.error('Xatolik yuz berdi:', data);
            }
        } catch (error) {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
            console.error('Server bilan aloqada xatolik:', error);
        }
    };

    const handleDeleteShop = async (shopId: string) => {
        try {
            const response = await fetch(`https://internet-magazin-nest-server.onrender.com/shops/${shopId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                notify.show("Do'kon muvaffaqiyatli o'chirildi!", "success", dark ? 'dark' : 'light')
                console.log('O\'chirildi:', data);
                handleGetShops(token);
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
        handleGetShops(token)
    }, [token])

    const [selectedShop, setSelectedShop] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const handleLogout = () => {
        setToken('')
        router.push(`/${locale}/auth`)
    }

    const handleShopClick = (shopTitle: string) => {
        router.push(`/${locale}/${encodeURIComponent(shopTitle.replaceAll(' ', '_'))}/dashboard`)
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
                        Mening do'konlarim
                    </h3>
                    <GlassButton
                        onClick={() => setShopAdd(true)}
                    >
                        add
                    </GlassButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shops.map((shop) => (
                        <GlassCard hover={true} className='flex items-center justify-between group' key={shop.id}>
                            <div
                                onClick={() => { setSelectShop(shop.id); handleShopClick(shop.id); }}
                                className="flex items-center gap-4 cursor-pointer flex-1"
                            >
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/10">
                                    <Image src={shop.logo} alt={shop.title} fill className="object-cover" />
                                </div>
                                <span className={`font-semibold ${dark ? 'text-white' : 'text-neutral-900'} group-hover:text-sky-500 transition-colors`}>
                                    {shop.title}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setSelectedShop(shop.id); setIsEditModalOpen(true); }}
                                    className={`p-2 rounded-lg ${dark ? 'bg-white/5 text-neutral-300' : 'bg-black/5 text-neutral-600'} hover:bg-sky-500/20 hover:text-sky-500 transition-all`}
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => { setSelectedShop(shop.id); setIsDeleteModalOpen(true); }}
                                    className={`p-2 rounded-lg ${dark ? 'bg-white/5 text-neutral-300' : 'bg-black/5 text-neutral-600'} hover:bg-red-500/20 hover:text-red-500 transition-all`}
                                >
                                    🗑️
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <GlassModal title="Do'kon ochish" onClose={() => setShopAdd(false)} open={shopAdd}>
                <form onSubmit={handleCreateShop} className="space-y-4">

                    <p className="text-zinc-400 text-sm">
                        Yangi do'kon ochish uchun uning nomini kiriting rasmini yuklang va kordinatasini belgilang.
                    </p>

                    <div className="flex flex-col w-full gap-4">
                        <GlassInput name='title' type='text' onKeyDown={(e) => {
                            if (e.key === '_') {
                                e.preventDefault();
                                return;
                            }

                            if (e.key === ' ' && e.currentTarget.value.endsWith(' ')) {
                                e.preventDefault();
                            }
                        }} maxLength={26} placeholder="Do'kon nomini yozing" />
                        <GlassInput name='logo' type='file' />
                    </div>

                    <GlassButton type='button' className='w-full' onClick={() => setOpenMap(true)}>xaritadan belgilash</GlassButton>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShopAdd(false)}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
                        >
                            Do'kon ochish
                        </button>
                    </div>
                </form>
            </GlassModal>

            <GlassModal title="Akkauntni o'chirish" onClose={() => setDeleteAkkModalOpen(false)} open={deleteAkkModalOpen}>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Haqiqatan ham akkauntingizni o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>
                    <div className="flex justify-end gap-3 mt-6">
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

            <GlassModal title="Do'konni o'chirish" onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen}>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Haqiqatan ham bu do'konni o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => {
                                handleDeleteShop(selectedShop)
                                setIsDeleteModalOpen(false)
                            }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Do'kon ochish
                        </button>
                    </div>
                </div>
            </GlassModal>
        </div>
    )
}