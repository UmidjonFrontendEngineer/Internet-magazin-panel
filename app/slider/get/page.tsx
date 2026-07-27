'use client'
import React, { useState, useEffect } from 'react'
import Slider from '@/app/_components/Slider'

const SliderGet = () => {
    const [count, setCount] = useState(0)
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchproducts = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const result: Product[] = await response.json();
                console.log(result);
                setProducts(result);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching products:', error.message);
                } else {
                    console.error('An unexpected error occurred:', error);
                }
            }
        };

        fetchproducts();
    }, []);
    return (
        <>
            <h1>slider</h1>
            <Slider count={count} link={true} products={products} setCount={setCount} />
        </>
    )
}

export default SliderGet
