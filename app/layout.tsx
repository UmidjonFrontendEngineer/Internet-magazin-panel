import LayoutWrapper from "./_components/LayoutWrapper";
import "@/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "internet do'kon - panel",
    description: "Next.js texnologiyasida full-stack e-commerce App.",
    keywords: ["nextjs", "react", "uzbekistan", "e-commerce", "internet do'kon", "internet do'kon"],

    openGraph: {
        title: "internet do'kon - panel",
        description: "Next.js texnologiyasida full-stack e-commerce App.",
        siteName: "internet do'kon",
        locale: "uz_UZ",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "internet do'kon - panel",
        description: "Next.js texnologiyasida full-stack e-commerce App.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uz">
            {/* Butun dizayn va client ishlari shu wrapper ichida bo'ladi */}
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
        </html>
    );
}