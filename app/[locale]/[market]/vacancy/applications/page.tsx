"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassButton from "@/components/admin/GlassButton";
import GlassCard from "@/components/admin/GlassCard";
import GlassModal from "@/components/admin/GlassModal";
import GlassTable from "@/components/admin/GlassTable";

interface Applicant {
    id: string;
    name: string;
    position: string;
    status: string;
    phone: string;
    bio: string;
    documentName: string;
    documentUrl: string;
    avatar: string;
    [key: string]: unknown;
}

function ApplicationsContent() {
    const searchParams = useSearchParams();
    const queryId = searchParams.get("id");
    const theme = useThemeStore((s) => s.theme);
    const dark = theme === "dark";

    const [applicants, setApplicants] = useState<Applicant[]>([
        {
            id: "646ff8e8-d80f-497c-bf87-5a5744bab839",
            name: "Jasurbek Alimov",
            position: "Frontend Dev (Next.js)",
            status: "Yangi",
            phone: "+998 90 123 45 67",
            bio: "3 yillik tajribaga ega, React va Next.js ekotizimida mutaxassis.",
            documentName: "Resume_Jasurbek.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Jasurbek+Alimov",
        },
        {
            id: "757aa9f9-e91g-508d-cg98-6b6855cbc940",
            name: "Malika Karimova",
            position: "UI/UX Designer",
            status: "Yangi",
            phone: "+998 91 987 65 43",
            bio: "E-commerce loyihalari bo'yicha kuchli tajribaga ega designer.",
            documentName: "Portfolio_Malika.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Malika+Karimova",
        },
        {
            id: "868bb0h0-f02h-619e-dh09-7c7966dcd051",
            name: "Sardorbek Tursunov",
            position: "Backend Developer (Nest.js)",
            status: "Qabul qilingan",
            phone: "+998 93 555 44 33",
            bio: "Nest.js, PostgreSQL va Docker texnologiyalari bilan ishlaydi.",
            documentName: "CV_Sardorbek.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Sardorbek+Tursunov",
        },
        {
            id: "979cc1i1-g13i-720f-ei10-8d8077ede162",
            name: "Zarnigor Rahimova",
            position: "Project Manager",
            status: "Ko'rib chiqilmoqda",
            phone: "+998 99 111 22 33",
            bio: "Agile va Scrum metodologiyalari bo'yicha sertifikatlangan PM.",
            documentName: "Resume_Zarnigor.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Zarnigor+Rahimova",
        },
        {
            id: "101dd2j2-h24j-831g-fj11-9e9188fef273",
            name: "Bekzod Rahimov",
            position: "Backend Developer (Nest.js)",
            status: "Yangi",
            phone: "+998 97 777 88 99",
            bio: "RESTful API va Mikroservislar arxitekturasi bo'yicha tajribaga ega.",
            documentName: "CV_Bekzod.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Bekzod+Rahimov",
        },
        {
            id: "202ee3k3-i35k-942h-gk22-0f0299gfg384",
            name: "Madina Saidova",
            position: "QA Engineer",
            status: "Rad etilgan",
            phone: "+998 94 444 33 22",
            bio: "Manual va avtomatlashtirilgan testlash bo'yicha 2 yil tajriba.",
            documentName: "Resume_Madina.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Madina+Saidova",
        },
        {
            id: "303ff4l4-j46l-053i-hl33-1g1300hgh495",
            name: "Timur Nazarov",
            position: "Fullstack Developer",
            status: "Qabul qilingan",
            phone: "+998 95 666 55 44",
            bio: "MERN va Next.js/Nest.js stacklarida mukammal ishlay oladi.",
            documentName: "CV_Timur.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Timur+Nazarov",
        },
        {
            id: "404gg5m5-k57m-164j-im44-2h2411ihi506",
            name: "Sevara Jumayeva",
            position: "Frontend Dev (React)",
            status: "Ko'rib chiqilmoqda",
            phone: "+998 98 333 22 11",
            bio: "TypeScript va TailwindCSS yordamida zamonaviy interfeyslar yaratadi.",
            documentName: "Resume_Sevara.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Sevara+Jumayeva",
        },
        {
            id: "505hh6n6-l68n-275k-jn55-3i3522jij617",
            name: "Otabek Qodirov",
            position: "DevOps Engineer",
            status: "Yangi",
            phone: "+998 93 222 11 00",
            bio: "CI/CD, AWS, Docker va Kubernetes bilan ish tajribasiga ega.",
            documentName: "CV_Otabek.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Otabek+Qodirov",
        },
        {
            id: "606ii7o7-m79o-386l-ko66-4j4633kjk728",
            name: "Dilnoza Usmanova",
            position: "HR Manager",
            status: "Ko'rib chiqilmoqda",
            phone: "+998 99 888 77 66",
            bio: "IT sohasida mutaxassislarni yollash va jamoani shakllantirish bo'yicha mutaxassis.",
            documentName: "Resume_Dilnoza.pdf",
            documentUrl: "#",
            avatar: "https://ui-avatars.com/api/?name=Dilnoza+Usmanova",
        },
    ]);

    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

    const handleAccept = (id: string) => {
        setApplicants((prev) => prev.map((app) => (app.id === id ? { ...app, status: "Qabul qilingan" } : app)));
    };

    const handleDelete = (id: string) => {
        if (confirm("Bu nomzodni o'chirmoqchimisiz?")) {
            setApplicants((prev) => prev.filter((app) => app.id !== id));
        }
    };

    const columns = [
        { key: "name", label: "Nomzod" },
        { key: "position", label: "Lavozim" },
        { key: "status", label: "Holati" },
        { key: "phone", label: "Telefon" },
    ];

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Ariza Markazi</h1>
                    <p className="text-gray-500 mt-2 text-lg">Barcha ishga topshirgan nomzodlar ro'yxati va ularni boshqarish.</p>
                </div>
                {queryId && (
                    <div className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 text-sky-500 rounded-xl font-mono text-sm">
                        ID: {queryId}
                    </div>
                )}
            </div>

            <div className="w-full">
                <GlassTable
                    columns={columns}
                    data={applicants as Record<string, unknown>[]}
                    actions={(row) => {
                        const applicant = row as Applicant;
                        return (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedApplicant(applicant)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition"
                                >
                                    Profil
                                </button>
                                {applicant.status !== "Qabul qilingan" && (
                                    <button
                                        onClick={() => handleAccept(applicant.id)}
                                        className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                                    >
                                        Qabul
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(applicant.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                >
                                    O'chirish
                                </button>
                                <button className="px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition">
                                    Xabar
                                </button>
                            </div>
                        );
                    }}
                />
            </div>

            {selectedApplicant && (
                <GlassModal title="To'liq Nomzod Ma'lumotlari" open={!!selectedApplicant} onClose={() => setSelectedApplicant(null)}>
                    <div className="p-4 space-y-6">
                        <div className="flex items-center gap-6">
                            <img src={selectedApplicant.avatar} alt={selectedApplicant.name} className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-xl" />
                            <div>
                                <h2 className="text-3xl font-bold">{selectedApplicant.name}</h2>
                                <p className="text-sky-400 font-medium text-lg">{selectedApplicant.position}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard>
                                <p className="text-gray-400 text-xs uppercase mb-1">Telefon</p>
                                <p className="font-semibold">{selectedApplicant.phone}</p>
                            </GlassCard>
                            <GlassCard>
                                <p className="text-gray-400 text-xs uppercase mb-1">Hujjat</p>
                                <a href={selectedApplicant.documentUrl} target="_blank" className="text-sky-400 hover:underline">
                                    {selectedApplicant.documentName}
                                </a>
                            </GlassCard>
                        </div>

                        <GlassCard>
                            <p className="text-gray-400 text-xs uppercase mb-2">Qo'shimcha ma'lumot</p>
                            <p className="leading-relaxed text-sm opacity-90">{selectedApplicant.bio}</p>
                        </GlassCard>

                        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                            <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">Yopish</button>
                            <GlassButton onClick={() => handleAccept(selectedApplicant.id)}>Intervyuga chaqirish</GlassButton>
                        </div>
                    </div>
                </GlassModal>
            )}
        </div>
    );
}

export default function ApplicationsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Yuklanmoqda...</div>}>
            <ApplicationsContent />
        </Suspense>
    );
}