'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface VacancyType {
    id: string
    title: string
    image: string
    salary: string
    description: string
    requiredRole: string
}

export default function VacancyDetail() {
    const params = useParams()
    const id = params.id
    const [vacancions, setVacancions] = useState<VacancyType[]>([])

    const searchParams = useSearchParams()
    const isOpen = searchParams.get('isOpen')
    const isWindowOpen = isOpen === 'true'

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

    // ID bo'yicha bitta vakansiyani olish (agar faqat bitta kerak bo'lsa) yoki hammasini chiqarish
    // Hozirgi holatda barcha vakansiyalar ro'yxati chiqarilyapti, agar faqat URL dagi id bo'yicha filter qilish kerak bo'lsa quyidagicha qilishingiz mumkin:
    const filteredVacancies = id 
        ? vacancions.filter(item => item.id === String(id)) 
        : vacancions

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {id ? `Vakansiya ID: ${id}` : 'Barcha Vakansiyalar'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Oyna holati: <span className="font-semibold">{isWindowOpen ? 'Kichik (Modal/Drawer)' : 'Katta ekran'}</span>
                    </p>
                </div>

                {/* Dinamik Grid va Card o'lchamlari */}
                <div className={`grid gap-6 ${
                    isWindowOpen 
                        ? 'grid-cols-1 max-w-xl mx-auto' // isOpen true bo'lsa kichikroq va markazda
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' // false bo'lsa standart katta ekran gridi
                }`}>
                    {filteredVacancies.map(item => (
                        <VacancyCard key={item.id} item={item} isWindowOpen={isWindowOpen} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function VacancyCard({ item, isWindowOpen }: { item: VacancyType; isWindowOpen: boolean }) {
    return (
        <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col ${
            isWindowOpen ? 'text-sm' : 'text-base'
        }`}>
            {/* Rasm qismi */}
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                <img 
                    src={item.image || 'https://via.placeholder.com/400x200'} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {item.salary}
                </div>
            </div>

            {/* Matnlar qismi */}
            <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 w-max px-2.5 py-1 rounded-md mb-2">
                    {item.requiredRole}
                </span>
                
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {item.description}
                </p>

                {/* Tugma */}
                <button 
                    onClick={() => alert(`Tanlangan vakansiya: ${item.title}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 shadow-sm text-center"
                >
                    Ariza topshirish
                </button>
            </div>
        </div>
    )
}