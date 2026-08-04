import React from 'react';

interface DashboardProps {
    params: Promise<{
        locale: string;
        shop: string;
    }>;
}

export default async function Dashboard({ params }: DashboardProps) {
    const { locale, shop } = await params;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Til (Locale): {locale}</p>
            <p>Do'kon ID (Shop ID): {shop}</p>
        </div>
    );
}