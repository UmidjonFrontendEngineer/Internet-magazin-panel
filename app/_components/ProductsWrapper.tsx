'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const ProductsWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const path = pathname.split('/')[1]
    return (
        <div className='mt-14'>
            <header className="flex items-center justify-between mb-8 font-semibold text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-widest max-[500px]:text-[8px]">
                <Link className="hover:text-white hover:underline duration-200" href="/">dashboard</Link>
                <Link className="hover:text-white hover:underline duration-200" href={`/${path}/get`}>get</Link>
                <Link className="hover:text-white hover:underline duration-200" href={`/${path}/post`}>post</Link>
                <Link className="hover:text-white hover:underline duration-200" href={`/${path}/put`}>put</Link>
                <Link className="hover:text-white hover:underline duration-200" href={`/${path}/patch`}>patch</Link>
                <Link className="hover:text-white hover:underline duration-200" href={`/${path}/delete`}>delete</Link>
                <Link href="/settings">
                    <Image src="/setting.png" alt="Settings" width={25} height={25} />
                </Link>
            </header>
            {children}
        </div>
    )
}

export default ProductsWrapper