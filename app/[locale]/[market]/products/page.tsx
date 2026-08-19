'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassCard from "@/components/admin/GlassCard";
import GlassInput from "@/components/admin/GlassInput";
import GlassButton from "@/components/admin/GlassButton";
import GlassModal from "@/components/admin/GlassModal";
import { useNotification } from "@/components/Notification";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { Plus, Trash2, Edit3, Layers, Upload, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Item from "./_components/item";
import ImageUpload from "./_components/image";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";
import GradientColor from "./_components/gradientColor";
import Discount from "./_components/discount";
import Category from "./_components/category";

interface ProductOption {
    name: string;
    value: number;
}

interface ProductOptionGroup {
    name: string;
    options: ProductOption[];
}

interface Product {
    id: number;
    title: string;
    description: {
        uz: string;
        en: string;
        ru: string;
    };
    foiz: number;
    tab: string;
    gradient_select: string;
    gradient: string[];
    chegirma_select: string;
    options: ProductOptionGroup[];
    images: string[];
    created_at: string;
}

const ProductsGet = () => {
    const theme = useThemeStore(state => state.theme);
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const notify = useNotification()
    const token = useTokenStore(state => state.token)
    const selectMarket = useSelectMarketStore(state => state.selectMarket)

    const bigData = [
        {
            id: 1,
            title: "MacBook Pro 16\" M3 Max",
            description: {
                "uz": "Yuqori unumdorlikka ega professional noutbuk, dasturchilar va dizaynerlar uchun mukammal tanlov.",
                "en": "High-performance professional laptop, the perfect choice for developers and designers.",
                "ru": "Высокопроизводительный профессиональный ноутбук, идеальный выбор для разработчиков и дизайнеров."
            },
            foiz: 10,
            tab: "laptop",
            gradient_select: "custom",
            gradient: ["#3b82f6", "#1d4ed8", "#9333ea"],
            chegirma_select: "active",
            options: [
                {
                    name: "Xotira (RAM)",
                    options: [
                        { name: "32 GB", value: 2500000 },
                        { name: "64 GB", value: 5000000 },
                        { name: "128 GB", value: 9000000 }
                    ]
                },
                {
                    name: "SSD hajmi",
                    options: [
                        { name: "1 TB", value: 1500000 },
                        { name: "2 TB", value: 3500000 },
                        { name: "4 TB", value: 7000000 }
                    ]
                }
            ],
            images: [
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60"
            ],
            created_at: "2026-01-10T10:00:00Z"
        },
        {
            id: 2,
            title: "iPhone 15 Pro Max",
            description: {
                "uz": "Eng so'nggi avlod flagman smartfoni, kuchli kamera va titan korpus bilan jihozlangan.",
                "en": "The latest generation flagship smartphone, equipped with a powerful camera and titanium body.",
                "ru": "Флагманский смартфон последнего поколения, оснащенный мощной камерой и титановым корпусом."
            },
            foiz: 5,
            tab: "smartphone",
            gradient_select: "custom",
            gradient: ["#64748b", "#334155", "#0f172a"],
            chegirma_select: "active",
            options: [
                {
                    name: "Ichki xotira",
                    options: [
                        { name: "256 GB", value: 12000000 },
                        { name: "512 GB", value: 14500000 },
                        { name: "1 TB", value: 17000000 }
                    ]
                }
            ],
            images: [
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1695048065448-439589d83dfa?w=800&auto=format&fit=crop&q=60"
            ],
            created_at: "2026-01-12T14:30:00Z"
        },
        {
            id: 3,
            title: "AirPods Max Wireless",
            description: {
                "uz": "Yuqori sifatli ovoz va faol shovqinni bostirish texnologiyasiga ega quloqchin.",
                "en": "Over-ear headphones with high-fidelity audio and active noise cancellation.",
                "ru": "Полноразмерные наушники с высококачественным звуком и активным шумоподавлением."
            },
            foiz: 0,
            tab: "audio",
            gradient_select: "custom",
            gradient: ["#ec4899", "#8b5cf6", "#3b82f6"],
            chegirma_select: "none",
            options: [
                {
                    name: "Rang",
                    options: [
                        { name: "Kosmik kulrang", value: 6500000 },
                        { name: "Kumushrang", value: 6500000 },
                        { name: "Ko'k", value: 6700000 }
                    ]
                }
            ],
            images: [
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
            ],
            created_at: "2026-01-15T09:15:00Z"
        },
        {
            id: 4,
            title: "Apple Watch Series 9",
            description: {
                "uz": "Sog'ligingizni nazorat qiluvchi va kunlik faolligingizni kuzatib boruvchi aqlli soat.",
                "en": "Smartwatch that monitors your health and tracks your daily activity.",
                "ru": "Умные часы, которые следят за вашим здоровьем и отслеживают ежедневную активность."
            },
            foiz: 15,
            tab: "watch",
            gradient_select: "custom",
            gradient: ["#ef4444", "#f97316", "#eab308"],
            chegirma_select: "active",
            options: [
                {
                    name: "Kassa o'lchami",
                    options: [
                        { name: "41 mm", value: 4500000 },
                        { name: "45 mm", value: 5100000 }
                    ]
                }
            ],
            images: [
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=60"
            ],
            created_at: "2026-01-18T16:20:00Z"
        },
        {
            id: 5,
            title: "iPad Pro 12.9\" M2",
            description: {
                "uz": "Liquid Retina XDR displey va o'ta kuchli M2 chipiga ega planshet.",
                "en": "Tablet featuring a Liquid Retina XDR display and the ultra-powerful M2 chip.",
                "ru": "Планшет с дисплеем Liquid Retina XDR и сверхмощным чипом M2."
            },
            foiz: 0,
            tab: "tablet",
            gradient_select: "custom",
            gradient: ["#10b981", "#06b6d4", "#3b82f6"],
            chegirma_select: "none",
            options: [
                {
                    name: "Xotira",
                    options: [
                        { name: "128 GB", value: 11000000 },
                        { name: "256 GB", value: 13000000 },
                        { name: "512 GB", value: 15500000 }
                    ]
                }
            ],
            images: [
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=60"
            ],
            created_at: "2026-01-20T11:00:00Z"
        }
    ]

    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false)

    const [activeImageIndices, setActiveImageIndices] = useState<{ [key: number]: number }>({});
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: { [groupName: string]: number } }>({});

    // ========= New Product =========

    const [imagesLength, setImagesLength] = useState(1)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [descr, setDescr] = useState('uz');
    const [lans, setLans] = useState(['uz', 'en', 'ru']);
    const [itemsLenght, setItemsLenght] = useState(1)
    const [gradientIsOpen, setGradientIsOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [categoryId, setCategoryId] = useState('')
    const [discountOpen, setDiscountOpen] = useState(false)
    const [discountId, setDiscountId] = useState('')

    const [colors, setColors] = useState<string[]>(['#3b82f6', '#3b82f6']);

    const handleColorChange = (index: number, newColor: string) => {
        const updated = [...colors];
        updated[index] = newColor;
        setColors(updated);
    };

    const handleAddColor = () => {
        setColors(prev => [...prev, '#3b82f6']);
    };

    const handleRemoveColor = (index: number) => {
        setColors(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        console.log("Saqlangan ranglar:", colors);

        setGradientIsOpen(false);
    };

    // ========= New Product =========

    useEffect(() => {
        descr === 'uz' ? setLans(['uz', 'en', 'ru']) :
            descr === 'en' ? setLans(['en', 'uz', 'ru']) :
                descr === 'ru' ? setLans(['ru', 'en', 'uz']) : '';
    }, [descr]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://internet-magazin-nest-server.onrender.com/products`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const result: Product[] = await response.json();
                setData(bigData);

                const initialIndices: { [key: number]: number } = {};
                const initialSelectedOpts: typeof selectedOptions = {};

                result.forEach(item => {
                    initialIndices[item.id] = 0;
                    initialSelectedOpts[item.id] = {};
                    item.options?.forEach(group => {
                        if (group.options && group.options.length > 0) {
                            initialSelectedOpts[item.id][group.name] = group.options[0].value;
                        }
                    });
                });

                setActiveImageIndices(initialIndices);
                setSelectedOptions(initialSelectedOpts);
            } catch (error) {
                console.error('Xatolik:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOptionSelect = (productId: number, groupName: string, value: number) => {
        setSelectedOptions(prev => ({
            ...prev,
            [productId]: {
                ...(prev[productId] || {}),
                [groupName]: value
            }
        }));
    };

    const handleNextImage = (productId: number, totalImages: number) => {
        setActiveImageIndices(prev => {
            const currentIndex = prev[productId] ?? 0;
            return { ...prev, [productId]: (currentIndex + 1) % totalImages };
        });
    };

    const handlePrevImage = (productId: number, totalImages: number) => {
        setActiveImageIndices(prev => {
            const currentIndex = prev[productId] ?? 0;
            return { ...prev, [productId]: (currentIndex - 1 + totalImages) % totalImages };
        });
    };

    const calculateTotalPrice = (product: Product) => {
        const productSelections = selectedOptions[product.id] || {};
        let optionsSum = 0;

        Object.values(productSelections).forEach(value => {
            optionsSum += value;
        });

        if (product.foiz > 0) {
            const discountAmount = (optionsSum * product.foiz) / 100;
            return optionsSum - discountAmount;
        }

        return optionsSum;
    };

    const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);
            formData.append('gradient', JSON.stringify(colors))
            formData.append('marketId', selectMarket)
            formData.append('warehouseId', 'warehouse-id-32');
            console.log(formData)

            const res = await fetch('https://internet-magazin-nest-server.onrender.com/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const req = await res.json()

            if (res.ok) {
                notify.show("Mahsulot muaffaqiyatli yaratildi.", 'success', theme === 'dark' ? 'dark' : 'light')
                setIsOpen(false)
            } else {
                notify.show(`${req.message || 'xatolik yuz berdi'}`, 'error', theme === 'dark' ? 'dark' : 'light')
            }
        } catch (err) {
            notify.show("So'rov yuborilmadi", 'error', theme === 'dark' ? 'dark' : 'light')
        }
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
            <div className="space-y-10 mx-auto">

                <GlassCard className='flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-10 w-full p-4'>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <h1 className='text-2xl font-bold'>Products</h1>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="relative flex items-center flex-1 sm:flex-initial">
                            <GlassInput
                                type="text"
                                placeholder="Search..."
                                // value={searchTerm}
                                // onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-48 sm:focus:w-72 transition-all duration-300 text-xs py-2"
                            />
                        </div>
                        <GlassButton className="whitespace-nowrap" onClick={() => setIsOpen(true)}>
                            Create Product
                        </GlassButton>
                    </div>
                </GlassCard>

                {loading || data.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(12).fill(null).map((_, index) => (
                            <GlassCard key={index} className={`space-y-4 animate-pulse`}>
                                <div className={`aspect-square w-full rounded-2xl ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                <div className={`h-3 rounded w-1/4 ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                <div className={`h-6 rounded w-3/4 ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                <div className="space-y-2">
                                    <div className={`h-4 rounded w-full ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                    <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className={`h-5 rounded w-1/3 ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                    <div className={`h-5 rounded w-1/4 ${theme === 'dark' ? 'bg-zinc-800/60' : 'bg-zinc-200'}`}></div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-10">
                        {data.map((item) => {
                            const activeIndex = activeImageIndices[item.id] ?? 0;
                            const hasImages = item.images && item.images.length > 0;
                            const currentImageUrl = hasImages ? item.images[activeIndex] : "https://dummyimage.com/600x600/18181b/a1a1aa";
                            const totalPrice = calculateTotalPrice(item);

                            const gradientStyle = item.gradient_select === 'custom' && item.gradient?.length > 0
                                ? {
                                    background: `linear-gradient(45deg, ${item.gradient.join(', ')})`,
                                }
                                : undefined;

                            return (
                                <GlassCard
                                    key={item.id}
                                    className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden transition-colors duration-300`}
                                >

                                    {gradientStyle && (
                                        <div
                                            className="absolute inset-0 opacity-15 pointer-events-none blur-[100px] animate-spin-slow"
                                            style={gradientStyle}
                                        />
                                    )}

                                    <div className="lg:col-span-6 grid grid-cols-12 gap-4 z-10">

                                        <div className="col-span-2 flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                                            {item.images?.map((img, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveImageIndices(prev => ({ ...prev, [item.id]: index }))}
                                                    className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all duration-200 ${index === activeIndex
                                                        ? "border-sky-500 scale-95 shadow-lg shadow-sky-500/20"
                                                        : theme === 'dark' ? "border-zinc-800 hover:border-zinc-700" : "border-zinc-200 hover:border-zinc-300"
                                                        }`}
                                                >
                                                    <Image src={img} alt={`thumb-${index}`} fill className="object-cover" sizes="80px" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className={`col-span-10 relative aspect-square rounded-2xl border overflow-hidden flex items-center justify-center group/slider ${theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-gray-50 border-zinc-200'
                                            }`}>

                                            <div className="relative w-full h-full p-4 transition-transform duration-500 ease-out group-hover/slider:scale-105">
                                                <Image
                                                    src={currentImageUrl}
                                                    alt={item.title}
                                                    fill
                                                    className="object-contain p-4"
                                                    sizes="500px"
                                                />
                                            </div>

                                            {item.images && item.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => handlePrevImage(item.id, item.images.length)}
                                                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all opacity-0 group-hover/slider:opacity-100 shadow-xl ${theme === 'dark'
                                                            ? 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                                                            : 'bg-white/80 border-zinc-200 text-zinc-700 hover:text-black hover:bg-white'
                                                            }`}
                                                        aria-label="Oldingi rasm"
                                                    >
                                                        <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => handleNextImage(item.id, item.images.length)}
                                                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all opacity-0 group-hover/slider:opacity-100 shadow-xl ${theme === 'dark'
                                                            ? 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                                                            : 'bg-white/80 border-zinc-200 text-zinc-700 hover:text-black hover:bg-white'
                                                            }`}
                                                        aria-label="Keyingi rasm"
                                                    >
                                                        <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}

                                            {item.foiz > 0 && (
                                                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-20 shadow-md">
                                                    -{item.foiz}% Chegirma
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6 z-10">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                ID: {item.id} • Turi: <span className={`capitalize ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.tab}</span>
                                            </span>
                                            <h2 className={`text-2xl font-bold mt-1 mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h2>

                                            <div className={`mb-4 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-sky-400/10 border-zinc-800/50' : 'bg-sky-50 border-sky-100'
                                                }`}>
                                                <span className={`text-xs block mb-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Tanlangan Konfiguratsiya Narxi:</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                        {totalPrice.toLocaleString()} UZS
                                                    </span>
                                                    {item.foiz > 0 && (
                                                        <span className={`text-sm line-through ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                            {(totalPrice / (1 - item.foiz / 100)).toLocaleString()} UZS
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className={`text-sm leading-relaxed p-4 rounded-xl border ${theme === 'dark' ? 'text-zinc-400 bg-sky-400/10 border-zinc-800/40' : 'text-zinc-600 bg-gray-50 border-gray-200'
                                                }`}>
                                                {item.description.uz}
                                            </p>
                                        </div>

                                        {item.options && item.options.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Konfiguratsiyani o'zgartirish:</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {item.options.map((optGroup, optIdx) => {
                                                        const activeVal = selectedOptions[item.id]?.[optGroup.name];
                                                        return (
                                                            <div key={optIdx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-gray-50 border-zinc-200'
                                                                }`}>
                                                                <span className={`text-xs font-semibold block capitalize mb-3 tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                                                                    }`}>
                                                                    {optGroup.name}
                                                                </span>
                                                                <div className="flex flex-col gap-2">
                                                                    {optGroup.options.map((opt, valIdx) => {
                                                                        const isSelected = activeVal === opt.value;
                                                                        return (
                                                                            <button
                                                                                key={valIdx}
                                                                                onClick={() => handleOptionSelect(item.id, optGroup.name, opt.value)}
                                                                                className={`flex justify-between items-center text-xs font-medium px-4 py-3 rounded-lg border transition-all duration-200 ${isSelected
                                                                                    ? "bg-sky-500/10 text-sky-500 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.1)]"
                                                                                    : theme === 'dark'
                                                                                        ? "bg-zinc-800/20 text-zinc-300 border-zinc-800 hover:bg-zinc-800/40 hover:border-zinc-700"
                                                                                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                                                                                    }`}
                                                                            >
                                                                                <span className="capitalize">{opt.name}</span>
                                                                                <span className={`font-semibold ${isSelected ? "text-sky-500" : theme === 'dark' ? "text-zinc-500" : "text-zinc-400"}`}>
                                                                                    +{opt.value.toLocaleString()} UZS
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </GlassCard>
                            );
                        })}
                    </div>
                )}

            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 22s linear infinite;
                }
            `}</style>

            <GlassModal open={isOpen} onClose={() => setIsOpen(false)} title='Create Product' size="full">
                <form onSubmit={handleCreateProduct}>

                    <div className="w-full flex gap-4 max-[650px]:flex-col">
                        <div className="w-full p-2 flex gap-4">
                            <div className="flex flex-col gap-3 h-[70vh] overflow-scroll">
                                {Array.from({ length: imagesLength }).map((_, index) => (
                                    <ImageUpload setImagesLength={setImagesLength} index={index} />
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <GlassInput label='price' name='price' placeholder="price..." />
                                <GlassInput label='quantity' name='quantity' placeholder="quantity..." />
                                <GlassButton type="button">category select</GlassButton>
                                <GlassButton type="button">warehouse select</GlassButton>
                                <GlassButton type="button" onClick={() => setGradientIsOpen(true)}>gradient</GlassButton>
                            </div>
                        </div>
                        <div className="w-full p-2 flex gap-4 flex-col">
                            <GlassInput placeholder='title' name='title' label='title' />

                            <div>
                                <div className="flex w-full">
                                    {lans.map(item => (
                                        <button key={item} type="button" className={`relative px-4 py-2 duration-200 text-sm ${item === descr ? 'border-sky-500/60 shadow-[0_0_0_3px_rgba(14,165,233,0.15)]' : ''} ${descr === item ? `bg-sky-200/10 border-t border-l border-r ${dark
                                            ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500'
                                            : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'}` : ''} translate-y-[2px] z-[10] rounded-xl rounded-bl-[0] rounded-br-[0]`} onClick={() => setDescr(item)}>
                                            {item === 'uz' ? 'O\'zbek' : item === 'en' ? 'English' : item === 'ru' ? 'Русский' : ''}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <textarea name='descriptionUz' className={`${descr === 'uz' ? '' : 'hidden'} rounded-[1rem] duration-200 focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] rounded-tl-[0] bg-sky-200/10 border py-2 px-4 w-full outline-none text-sm ${dark
                                        ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500'
                                        : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'
                                        }`} placeholder="UZ description..." rows={6}></textarea>
                                    <textarea name='descriptionEn' className={`${descr === 'en' ? '' : 'hidden'} rounded-[1rem] duration-200 focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] rounded-tl-[0] bg-sky-200/10 border py-2 px-4 w-full outline-none text-sm ${dark
                                        ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500'
                                        : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'
                                        }`} placeholder="EN description..." rows={6}></textarea>
                                    <textarea name='descriptionRu' className={`${descr === 'ru' ? '' : 'hidden'} rounded-[1rem] duration-200 focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] rounded-tl-[0] bg-sky-200/10 border py-2 px-4 w-full outline-none text-sm ${dark
                                        ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500'
                                        : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'
                                        }`} placeholder="RU description..." rows={6}></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {Array.from({ length: itemsLenght }).map((_, index) => (
                                    <Item key={index} cIndex={index} setItemsLenght={setItemsLenght} />
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="p-6"></div>

                    <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <GlassButton
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                        >
                            Save
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>

            <GlassModal
                open={gradientIsOpen}
                onClose={() => setGradientIsOpen(false)}
                title="gradient"
            >
                {colors.map((color, index) => (
                    <GradientColor
                        key={index}
                        index={index}
                        color={color}
                        onChange={(newColor) => handleColorChange(index, newColor)}
                        onRemove={() => handleRemoveColor(index)}
                        canDelete={colors.length > 1}
                    />
                ))}

                <GlassButton onClick={handleAddColor}>+</GlassButton>

                <div className="p-6"></div>

                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                    <button
                        onClick={() => setGradientIsOpen(false)}
                        type="button"
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <GlassButton
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                    >
                        Save
                    </GlassButton>
                </div>
            </GlassModal>

            <GlassModal open={discountOpen} onClose={() => setDiscountOpen(false)} title='discount'>
                <Discount setDiscountId={setDiscountId} />

                <div className="p-6"></div>
                
                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                    <button
                        onClick={() => setDiscountOpen(false)}
                        type="button"
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <GlassButton
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                    >
                        Save
                    </GlassButton>
                </div>
            </GlassModal>

            
            <GlassModal open={discountOpen} onClose={() => setCategoryOpen(false)} title='discount'>
                <Category setCategoryId={setCategoryId} />

                <div className="p-6"></div>
                
                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                    <button
                        onClick={() => setCategoryOpen(false)}
                        type="button"
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <GlassButton
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                    >
                        Save
                    </GlassButton>
                </div>
            </GlassModal>
        </div>
    );
};

export default ProductsGet;