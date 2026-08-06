import React from 'react';

interface DashboardProps {
    params: Promise<{
        locale: string;
        market: string;
    }>;
}

export default async function Dashboard({ params }: DashboardProps) {
    const { locale, market } = await params;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Til (Locale): {locale}</p>
            <p>Market ID (Market ID): {market}</p>
        </div>
    );
}