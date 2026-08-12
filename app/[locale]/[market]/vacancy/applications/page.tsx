"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useThemeStore } from "@/app/_store/useThemeStore";
import GlassTable from "@/components/admin/GlassTable";
import GlassModal from "@/components/admin/GlassModal";
import GlassCard from "@/components/admin/GlassCard";
import GlassButton from "@/components/admin/GlassButton";
import { useTokenStore } from "@/app/_store/useTokenStore";
import { useNotification } from "@/components/Notification";
import { useSelectMarketStore } from "@/app/_store/useSelectMarketStore";

interface ApplicantItem {
    rate: number | null;
    email: string;
    image: string | null;
    message: string;
}

interface Vacancy {
    id: string;
    applicants: ApplicantItem[];
    title: string;
}

interface UserProfile {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    bio: string;
    name: string;
    message?: string;
    rate: number | null | string;
    applicantImage: string | null;
    [key: string]: unknown;
}

function ApplicationsContent() {
    const searchParams = useSearchParams();
    const queryId = searchParams.get("id");
    const notify = useNotification()
    const [matchedUsers, setMatchedUsers] = useState<UserProfile[]>([]);
    const [vacancyTitle, setVacancyTitle] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [rateModal, setRateModal] = useState(false)
    const [rateCount, setRateCount] = useState(0)
    const [selectEmail, setSelectEmail] = useState('')
    const [messageModal, setMessageModal] = useState<null | string>(null)
    const [imageModal, setImageModal] = useState(false)
    const token = useTokenStore(state => state.token)
    const dark = useThemeStore(state => state.theme) === 'dark' ? true : false
    const selectMarket = useSelectMarketStore(state => state.selectMarket)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [vRes, uRes] = await Promise.all([
                    fetch("https://internet-magazin-nest-server.onrender.com/vacancies"),
                    fetch("https://internet-magazin-nest-server.onrender.com/users")
                ]);

                const vacancies: Vacancy[] = await vRes.json();
                const users: UserProfile[] = await uRes.json();

                const currentVacancy = vacancies.find((v) => v.id === queryId);
                if (currentVacancy) {
                    setVacancyTitle(currentVacancy.title);
                    const vacancyApplicants = currentVacancy.applicants || [];

                    const filtered = users
                        .filter((u) => vacancyApplicants.some((app) => app.email === u.email))
                        .map((u) => {
                            const applicantData = vacancyApplicants.find((app) => app.email === u.email);
                            return {
                                ...u,
                                name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Ism kiritilmagan",
                                phone: u.phone || "Kiritilmagan",
                                bio: u.bio || "Kiritilmagan",
                                message: applicantData?.message || "Xabar yo'q",
                                rate: applicantData?.rate ?? null,
                                applicantImage: applicantData?.image || u.image,
                            };
                        });

                    setMatchedUsers(filtered);
                }
            } catch (err) {
                console.error("Xatolik:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [queryId]);

    const handleDelete = (email: string) => {
        if (confirm("Bu nomzodni ro'yxatdan o'chirmoqchimisiz?")) {
            setMatchedUsers((prev) => prev.filter((user) => user.email !== email));
        }
    };

    const handleRate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (rateCount === 0) return

        try {
            const res = await fetch(`https://internet-magazin-nest-server.onrender.com/vacancies/${queryId}/rate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rateCount, selectEmail })
            })

            if (res.ok) {
                const data = await res.json()
                notify.show('Muaffaqiyatli yuborildi', "success", dark ? 'dark' : 'light')
                setRateModal(false)
            } else {
                notify.show('Xatolik yuz berdi', "error", dark ? 'dark' : 'light')
            }
        } catch (err) {
            notify.show("So'rov yuborilmadi", "error", dark ? 'dark' : 'light')
        }
    }

    const handleAccept = async (applicantEmail: string, marketId: string, vacancyId: string) => {
        try {
            const res = await fetch('https://internet-magazin-nest-server.onrender.com/workers', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    userEmail: applicantEmail, 
                    marketId: marketId,
                    VacancyId: vacancyId 
                })
            });
            
            const req = await res.json();
    
            if (res.ok) {
                notify.show("Ishga olindi", "success", dark ? 'dark' : 'light');
            } else {
                notify.show(req.message || 'Xatolik yuz berdi', "error", dark ? 'dark' : 'light');
            }
        } catch (err) {
            notify.show("So'rov yuborilmadi", "error", dark ? 'dark' : 'light');
            console.log(err);
        }
    }

    return (
        <div className="w-full max-w-[1500px] mx-auto p-8">
            <div className="mb-10 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Ariza Markazi</h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        {vacancyTitle ? `Vakansiya: ${vacancyTitle}` : "Nomzodlar ma'lumotlari"}
                    </p>
                </div>
                {queryId && (
                    <div className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 text-sky-500 rounded-xl font-mono text-sm">
                        ID: {queryId}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500 text-lg">Yuklanmoqda...</div>
            ) : (
                <GlassTable
                    columns={[
                        { key: "name", label: "Nomzod" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Telefon" },
                        { key: "bio", label: "Bio" },
                    ]}
                    data={matchedUsers as Record<string, unknown>[]}
                    actions={(row) => {
                        const user = row as UserProfile;
                        return (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedUser(user)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition text-gray-200"
                                >
                                    Profil
                                </button>
                                <button
                                    onClick={() => handleAccept(user.id, selectMarket, queryId)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                                >
                                    Qabul
                                </button>
                                <button
                                    onClick={() => handleDelete(user.email)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                >
                                    O'chirish
                                </button>
                                <button
                                    onClick={() => setMessageModal(user.email)}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                >
                                    Xabar
                                </button>
                                <button
                                    onClick={() => { setRateModal(true); setSelectEmail(user.email) }}
                                    className="px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                >
                                    Baholash
                                </button>
                            </div>
                        );
                    }}
                />
            )}

            {selectedUser && (
                <GlassModal title="Profile" open={!!selectedUser} size="3xl" onClose={() => setSelectedUser(null)}>
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <img
                                src={selectedUser.image || "https://i.ibb.co/nNZrjBSD/user.png"}
                                alt={selectedUser.name}
                                className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-xl"
                            />
                            <div>
                                <h2 className="text-3xl font-bold">{selectedUser.name}</h2>
                                <p className="text-sky-400 font-medium text-lg">@{selectedUser.userName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard>
                                <p className="text-gray-400 text-xs uppercase mb-1">Email</p>
                                <p className="font-semibold">{selectedUser.email}</p>
                            </GlassCard>
                            <GlassCard>
                                <p className="text-gray-400 text-xs uppercase mb-1">Telefon</p>
                                <p className="font-semibold">{selectedUser.phone}</p>
                            </GlassCard>
                        </div>

                        <GlassCard>
                            <p className="text-gray-400 text-xs uppercase mb-2">Bio</p>
                            <p className="leading-relaxed text-sm opacity-90">{selectedUser.bio}</p>
                        </GlassCard>

                        <GlassCard>
                            <p className="text-gray-400 text-xs uppercase mb-2">Ariza Xabari</p>
                            <p className="leading-relaxed text-sm opacity-90">{selectedUser.message}</p>
                        </GlassCard>

                        <div className="p-6"></div>

                        <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Yopish
                            </button>
                            <button
                                onClick={() => handleAccept(selectedUser.email)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                            >
                                Qabul qilish
                            </button>
                        </div>
                    </div>
                </GlassModal>
            )}

            {rateModal && (
                <GlassModal title='Baholash' open={rateModal} onClose={() => setRateModal(false)}>
                    <form onSubmit={handleRate} className="space-y-6">
                        <div className="flex items-center justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRateCount(index + 1)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-all duration-200 ${rateCount > index
                                        ? 'text-yellow-400 scale-110'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <div className="p-6"></div>

                        <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                            <button
                                onClick={() => setRateModal(false)}
                                type="button"
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                            >
                                Baholash
                            </button>
                        </div>
                    </form>
                </GlassModal>
            )}

            {messageModal && (
                <GlassModal title="Message" open={!!messageModal} size="3xl" onClose={() => setMessageModal(null)} className="relative">
                    <div className="space-y-4 max-h-[70vh]">
                        <h1>{matchedUsers.find(item => item.email === messageModal)?.message}</h1>

                        <p className="text-zinc-300">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero eaque, totam repellat error vitae consectetur impedit, earum suscipit autem quia corporis voluptate unde veritatis sapiente qui quasi odit illo assumenda?
                            Fugit amet sapiente velit labore sequi tempora, voluptates accusamus architecto minima aperiam voluptate optio asperiores beatae repellat odit dolores magni nobis porro atque fuga adipisci sit. Molestias adipisci ratione soluta.
                            Quasi ipsum pariatur vitae a deleniti dolor assumenda tempore nobis atque consequatur et natus odio cupiditate, ea esse enim tempora qui odit quod fugit soluta at veritatis aliquid mollitia? Quis.
                            Praesentium, perspiciatis dicta? Et, ea animi? Maxime quam, iusto nostrum consequuntur doloribus rem incidunt odit illum totam aspernatur delectus numquam eaque quibusdam distinctio dolorum sunt, ea, ullam eligendi. Laborum, autem.
                            Nostrum eaque maxime veritatis aliquam odit dolor obcaecati, saepe fugit, tempora delectus id, sunt amet ab inventore ratione cupiditate vitae ut veniam in distinctio nulla accusamus illo. Praesentium, inventore enim!
                            Tempora repellat porro animi nulla ea optio veniam, magni explicabo in necessitatibus sunt excepturi cumque doloribus, debitis qui ipsa aperiam eaque magnam labore natus vitae sapiente. Quia doloremque eaque culpa?
                            Dignissimos saepe laudantium ex officiis eos fugit fuga facere. Dolorem pariatur esse, accusamus, dolores vel voluptate ipsum mollitia culpa quisquam at ad odit dicta non rem ullam magni recusandae voluptatem?
                            Voluptate magni consectetur culpa dignissimos accusamus est expedita minus, accusantium aperiam repellat atque ducimus praesentium numquam ad odit, deleniti animi tempore! Ab explicabo ut amet, molestias tempora qui officia deleniti.
                            Totam recusandae quo fugit eum quaerat impedit, nisi maxime ullam eius laboriosam consequuntur culpa suscipit sunt aliquam tempora, distinctio vitae quae quibusdam exercitationem neque saepe voluptas minus minima dolorum? Autem?
                            Nostrum vero qui eaque quidem distinctio omnis, ipsum fugit, provident a voluptatum et accusamus. Pariatur eos, veniam doloribus maxime omnis, nisi dolores et nobis sint ipsa sequi hic, temporibus saepe?
                        </p>

                        {matchedUsers.find(item => item.email === messageModal)?.applicantImage && (
                            <Image
                                src={`${matchedUsers.find(item => item.email === messageModal)?.applicantImage!}`}
                                alt="Applicant"
                                className="rounded-2xl"
                                width={1000}
                                height={300}
                            />
                        )}

                        <div className="flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 pt-0 backdrop-blur-sm rounded-b-[28px]">
                            <button
                                onClick={() => setMessageModal(null)}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Yopish
                            </button>
                            <button
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                            >
                                Chat boshlash
                            </button>
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