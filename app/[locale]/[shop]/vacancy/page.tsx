'use client'
import GlassCard from '@/components/admin/GlassCard'
import GlassInput from '@/components/admin/GlassInput'
import GlassModal from '@/components/admin/GlassModal'
import React, { useEffect, useState } from 'react'
import { useThemeStore } from '@/app/_store/useThemeStore'
import GlassButton from '@/components/admin/GlassButton'
import { useSelectMarketStore } from '@/app/_store/useSelectMarketStore'
import { useTokenStore } from '@/app/_store/useTokenStore'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useNotification } from '@/components/Notification'
import Image from 'next/image'
import GlassWindow from '@/components/admin/GlassWindow'

interface VacancyType {
    id: string;
    title: string;
    image: string;
    salary: string;
    description: string;
    requiredRole: string;
    requiredWorkers: string;
}

interface VacancyCardProps {
    item: VacancyType;
    locale: string;
}

const VacancyCard = ({ item }: VacancyCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const isLongDescription = item.description.length > 100

    const displayedDescription = isExpanded
        ? item.description
        : item.description.slice(0, 100) + (isLongDescription ? '...' : '')

    return (
        <GlassCard className="flex flex-col relative justify-between h-full overflow-hidden group cursor-pointer">
            <Link href={`?id=${item.id}&isFullScreen=${false}`} scroll={false}>
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-2xl">
                    <Image
                        width={500}
                        height={300}
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
                </div>
            </Link>
        </GlassCard>
    )
}

const Vacancy = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const notify = useNotification()
    const params = useParams();
    const locale = params?.locale as string || 'uz';

    const [isOpen, setIsOpen] = useState(false)
    const [vacancions, setVacancions] = useState<VacancyType[]>([])
    const [vacancy, setVacancy] = useState<VacancyType | null>(null)

    const dark = useThemeStore(state => state.theme) === 'dark'
    const selectMarket = useSelectMarketStore(state => state.selectMarket)
    const token = useTokenStore(state => state.token)

    const vacancyId = searchParams.get('id')
    const isFullScreen = searchParams.get('isFullScreen') === 'true'

    const getVacancions = async () => {
        try {
            const res = await fetch('https://internet-magazin-nest-server.onrender.com/vacancies')
            const result = await res.json()
            setVacancions(result)

            if (vacancyId) {
                const found = result.find((item: VacancyType) => item.id === vacancyId)
                setVacancy(found || null)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getVacancions()
    }, [vacancyId])

    const handleCloseDetailModal = () => {
        router.push('vacancy', { scroll: false })
        setVacancy(null)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('marketId', selectMarket);

        const response = await fetch('https://internet-magazin-nest-server.onrender.com/vacancies', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            notify.show("Vakansiya muvaffaqiyatli qo'shildi!", "success", dark ? 'dark' : 'light')
            setIsOpen(false);
            getVacancions();
        } else {
            notify.show("Xatolik yuz berdi", "error", dark ? 'dark' : 'light')
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {vacancions.map(item => (
                    <VacancyCard key={item.id} item={item} locale={locale} />
                ))}
            </div>

            {vacancy && (
                <GlassWindow title='Vakansiya tafsilotlari' open={true} size={isFullScreen ? 'full' : 'xl'} onClose={handleCloseDetailModal}>
                    <div className="flex flex-col relative justify-between h-full overflow-hidden group">
                        <div className="relative w-full h-[50vh] mb-4 overflow-hidden rounded-2xl">
                            <Image
                                width={5000000000000000000}
                                height={3000000000000000000}
                                src={vacancy.image}
                                alt={vacancy.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 text-xs font-medium backdrop-blur-md bg-black/40 text-white rounded-full border border-white/20">
                                    {vacancy.requiredRole}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-xl font-bold tracking-tight">
                                {vacancy.title}
                            </h3>
                            <span className="text-lg font-semibold whitespace-nowrap text-sky-500">
                                {vacancy.salary} $
                            </span>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm opacity-80 leading-relaxed">
                                {vacancy.description}
                            </p>
                        </div>

                        <div className="mb-6"><p>ishchilar soni: {vacancy.requiredWorkers}</p></div>
                    </div>
                </GlassWindow>
            )}

            {isOpen && (
                <GlassModal title="Elon berish" open={isOpen} onClose={() => setIsOpen(false)}>
                    <form className="space-y-4 max-h-[75vh] overflow-y-auto p-1" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Title</label>
                            <GlassInput name='title' type='text' placeholder="Qisqacha mavzu" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Oylik maosh</label>
                            <GlassInput name='salary' type='number' placeholder="Oylik Maosh" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Rasm yuklang</label>
                            <GlassInput name='image' type='file' />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Batafsil</label>
                            <textarea
                                name='description'
                                placeholder="Ish haqida to'liq ma'lumot"
                                rows={6}
                                className={`w-full rounded-2xl py-3 px-4 outline-none transition-all duration-200 border focus:border-sky-500/60 ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500' : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'
                                    }`}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Ishchilar soni</label>
                            <GlassInput name='requiredWorkers' type='number' placeholder="Ishchilar soni" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Rolni tanlang</label>
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
            )}
        </div>
    )
}

export default Vacancy