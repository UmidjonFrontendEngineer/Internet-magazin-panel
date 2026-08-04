'use client'
import GlassCard from '@/components/admin/GlassCard'
import GlassInput from '@/components/admin/GlassInput'
import GlassModal from '@/components/admin/GlassModal'
import React, { useEffect, useState } from 'react'
import { useThemeStore } from '@/app/_store/useThemeStore'
import GlassButton from '@/components/admin/GlassButton'
import { useSelectShopStore } from '@/app/_store/useSelectShopStore'
import { useTokenStore } from '@/app/_store/useTokenStore'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Map from '@/app/_components/Map'

interface VacancyType {
    id: string,
    title: string,
    image: string,
    salary: string,
    description: string,
    requiredRole: string,
}

interface VacancyCardProps {
    item: VacancyType;
    locale: string;
}

const VacancyCard = ({ item, locale }: VacancyCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const isLongDescription = item.description.length > 100

    const displayedDescription = isExpanded
        ? item.description
        : item.description.slice(0, 100) + (isLongDescription ? '...' : '')

    return (
        <GlassCard className="flex flex-col justify-between h-full overflow-hidden group">
            <div>
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-2xl">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-medium backdrop-blur-md bg-black/40 text-white rounded-full border border-white/20">
                            {item.requiredRole}
                        </span>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold tracking-tight line-clamp-1">
                        {item.title}
                    </h3>
                    <span className="text-lg font-semibold whitespace-nowrap text-sky-500">
                        {item.salary} $
                    </span>
                </div>

                <div className="mb-6">
                    <p className="text-sm opacity-80 leading-relaxed transition-all duration-300">
                        {displayedDescription}
                    </p>
                    {isLongDescription && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-1 text-xs font-medium text-sky-400 hover:underline focus:outline-none"
                        >
                            {isExpanded ? 'Yashirish' : 'Ko\'proq o\'qish'}
                        </button>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                <Link
                    href={`/${locale}/vacancy/${item.id}`}
                    className="px-4 py-2 text-sm font-medium rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 transition-colors duration-200 text-center"
                >
                    Batafsil
                </Link>
            </div>
        </GlassCard>
    )
}

const Vacancy = () => {
    const params = useParams();
    const locale = params?.locale as string || 'uz';

    const [isOpen, setIsOpen] = useState(false)
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const selectShop = useSelectShopStore(state => state.selectShop)
    const token = useTokenStore(state => state.token)
    const [vacancions, setVacancions] = useState<VacancyType[]>([])

    const getVacancions = async () => {
        try {
            const res = await fetch('https://internet-magazin-nest-server.onrender.com/vacancies')
            const result = await res.json()
            setVacancions(result)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getVacancions()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        formData.append('shopId', selectShop);

        const response = await fetch('https://internet-magazin-nest-server.onrender.com/vacancies', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert('Vakansiya muvaffaqiyatli qo\'shildi!');
            setIsOpen(false);
            getVacancions();
        } else {
            alert(result.message || 'Xatolik yuz berdi');
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4'>
            <GlassCard className='flex justify-between items-center gap-4 sticky top-0 z-10 w-full bg-slate-900/50 backdrop-blur-md p-4'>
                <h1 className='text-2xl font-bold'>Vacancy</h1>
                <GlassButton onClick={() => setIsOpen(true)}>
                    Create Vacancy
                </GlassButton>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vacancions.map(item => (
                    <VacancyCard key={item.id} item={item} locale={locale} />
                ))}
            </div>

            <Map
                isDarkMode={dark}
                onLocationSelect={(lat, lng) => {
                    console.log("Tanlangan koordinatalar:", lat, lng);
                }}
            />

            {
                isOpen && (
                    <GlassModal title="Elon berish" open={isOpen} onClose={() => setIsOpen(false)}>
                        <form className="space-y-4 overflow-scroll h-full" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                    Title
                                </label>
                                <GlassInput name='title' type='text' placeholder="Qisqacha mavzu" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                    Oylik maosh
                                </label>
                                <GlassInput name='salary' type='number' placeholder="Oylik Maosh" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                    Rasm yuklang
                                </label>
                                <GlassInput name='image' type='file' />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                    Batafsil
                                </label>
                                <div className="space-y-1.5">
                                    <textarea
                                        name='description'
                                        placeholder="Ish haqida to'liq ma'lumot"
                                        rows={8}
                                        className={`w-full rounded-2xl py-3 px-4 outline-none transition-all duration-200 border focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]
                                            ${dark
                                                ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500'
                                                : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'}
                                        `}
                                    ></textarea>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                    Ishchilar soni
                                </label>
                                <GlassInput name='requiredWorkers' type='number' placeholder="Ishchilar soni" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                    Rolni tanlang
                                </label>
                                <select
                                    name='requiredRole'
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors text-sm"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="saler">Saler</option>
                                    <option value="meneger">Meneger</option>
                                    <option value="wherehouse">Wherehouse</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    type="button"
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </form>
                    </GlassModal>
                )
            }
        </div>
    )
}

export default Vacancy