import React, { useState, useEffect } from 'react';
import GlassModal from '@/components/admin/GlassModal';
import GlassInput from '@/components/admin/GlassInput';
import GlassButton from '@/components/admin/GlassButton';
import ImageUpload from './_components/image';
import Item from './_components/item';
import GradientColor from './_components/gradientColor';
import Discount from './_components/discount'
import Category from './_components/category';
import WarehousePage from './_components/warehouse';

interface Product {
    id: string;
    title: string;
    price: number;
    quantity: number;
    descriptionUz?: string;
    descriptionEn?: string;
    descriptionRu?: string;
    categoryId?: string;
    discountId?: string;
    warehouseId?: string;
    marketId?: string;
    images?: string[];
    colors?: string[];
    items?: any[];
}

export const ProductsGet: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [gradientIsOpen, setGradientIsOpen] = useState<boolean>(false);
    const [discountOpen, setDiscountOpen] = useState<boolean>(false);
    const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
    const [warehouseOpen, setWarehouseOpen] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);

    const [imagesLength, setImagesLength] = useState<number>(1);
    const [itemsLenght, setItemsLenght] = useState<number>(1);
    const [descr, setDescr] = useState<string>('uz');
    const lans = ['uz', 'en', 'ru'];

    const [colors, setColors] = useState<string[]>(['#ffffff']);
    const [discountId, setDiscountId] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [warehouseId, setWarehouseId] = useState<string>('');
    const [marketId, setMarketId] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const dark = true;

    const [categoryTitle, setCategoryTitle] = useState<string>('');
    const [optionTitle, setOptionTitle] = useState<string>('');
    const [subOptionTitle, setSubOptionTitle] = useState<string>('');

    useEffect(() => {
        if (!categoryId) {
            setCategoryTitle('');
            setOptionTitle('');
            setSubOptionTitle('');
            return;
        }

        const parts = categoryId.split('|');
        const catId = parts[0] || '';
        const optId = parts[1] || '';
        const subOptId = parts[2] || '';

        setCategoryTitle(catId ? `Category: ${catId}` : '');
        setOptionTitle(optId ? `Option: ${optId}` : '');
        setSubOptionTitle(subOptId ? `SubOption: ${subOptId}` : '');
    }, [categoryId]);

    const handleColorChange = (index: number, newColor: string) => {
        const updated = [...colors];
        updated[index] = newColor;
        setColors(updated);
    };

    const handleRemoveColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleAddColor = () => {
        setColors([...colors, '#ffffff']);
    };

    const handleSaveGradient = () => {
        setGradientIsOpen(false);
    };

    const handleOpenEdit = (product: Product) => {
        setEditId(product.id);
        setCategoryId(product.categoryId || '');
        setDiscountId(product.discountId || '');
        setWarehouseId(product.warehouseId || '');
        setMarketId(product.marketId || '');
        if (product.colors && product.colors.length > 0) {
            setColors(product.colors);
        }
        setIsOpen(true);
    };

    const handleCreateProduct = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            formData.append('categoryId', categoryId);
            formData.append('discountId', discountId);
            formData.append('warehouseId', warehouseId);
            formData.append('marketId', marketId);
            formData.append('colors', JSON.stringify(colors));

            if (editId) {
                console.log("Updating product ID:", editId, Object.fromEntries(formData));
            } else {
                console.log("Creating new product:", Object.fromEntries(formData));
            }
            setIsOpen(false);
            setEditId(null);
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        console.log("Deleted product id:", id);
    };return (
        <div className="p-6 relative min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products Management</h1>
                    <p className="text-sm text-neutral-400">Manage your store products, options, and market structures.</p>
                </div>
                <button 
                    onClick={() => { 
                        setEditId(null); 
                        setCategoryId('');
                        setDiscountId('');
                        setWarehouseId('');
                        setMarketId('');
                        setColors(['#ffffff']);
                        setIsOpen(true); 
                    }}
                    className="px-5 py-2.5 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                >
                    Create Product
                </button>
            </div>

            <GlassModal open={isOpen} onClose={() => { setIsOpen(false); setEditId(null); }} title={editId ? 'Edit Product' : 'Create Product'} size="full">
                <form onSubmit={handleCreateProduct}>
                    <div className="w-full flex gap-4 max-[650px]:flex-col h-[70vh] pb-16">
                        <div className="w-full p-2 flex gap-4 h-full max-[650px]:flex-col">
                            <div className="flex flex-col gap-3 overflow-y-auto max-h-full pr-2 w-full">
                                {Array.from({ length: imagesLength }).map((_, index) => (
                                    <ImageUpload key={index} setImagesLength={setImagesLength} index={index} />
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 h-full overflow-y-auto max-h-full pr-2 w-full">
                                <GlassInput label='price' name='price' placeholder="price..." required />
                                <GlassInput label='quantity' name='quantity' placeholder="quantity..." required />
                                
                                <GlassButton type="button" onClick={() => setCategoryOpen(true)}>
                                    {categoryId ? `${subOptionTitle || optionTitle || categoryTitle}` : 'Category Select'}
                                </GlassButton>

                                <GlassButton type="button" onClick={() => setDiscountOpen(true)}>
                                    {discountId ? `Discount ID: ${discountId}` : 'Discount Select'}
                                </GlassButton>

                                <GlassButton type="button" onClick={() => setWarehouseOpen(true)}>
                                    {warehouseId ? `Warehouse ID: ${warehouseId}` : 'Warehouse Select'}
                                </GlassButton>

                                <GlassButton type="button" onClick={() => setGradientIsOpen(true)}>
                                    Gradient Colors ({colors.length})
                                </GlassButton>
                            </div>
                        </div>
                        
                        <div className="w-full p-2 flex gap-4 flex-col overflow-y-auto h-full max-h-full">
                            <GlassInput placeholder='title' name='title' label='title' required />

                            <div>
                                <div className="flex w-full">
                                    {lans.map(item => (
                                        <button 
                                            key={item} 
                                            type="button" 
                                            className={`relative px-4 py-2 duration-200 text-sm ${item === descr ? 'border-sky-500/60 shadow-[0_0_0_3px_rgba(14,165,233,0.15)]' : ''} ${descr === item ? `bg-sky-200/10 border-t border-l border-r ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500' : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'}` : ''} translate-y-[2px] z-[10] rounded-xl rounded-bl-[0] rounded-br-[0]`} 
                                            onClick={() => setDescr(item)}
                                        >
                                            {item === 'uz' ? 'O\'zbek' : item === 'en' ? 'English' : item === 'ru' ? 'Русский' : ''}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <textarea name='descriptionUz' className={`${descr === 'uz' ? '' : 'hidden'} rounded-[1rem] duration-200 focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] rounded-tl-[0] bg-sky-200/10 border py-2 px-4 w-full outline-none text-sm ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500' : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'}`} placeholder="UZ description..." rows={6}></textarea>
                                    <textarea name='descriptionEn' className={`${descr === 'en' ? '' : 'hidden'} rounded-[1rem] duration-200 focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] rounded-tl-[0] bg-sky-200/10 border py-2 px-4 w-full outline-none text-sm ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500' : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'}`} placeholder="EN description..." rows={6}></textarea>
                                    <textarea name='descriptionRu' className={`${descr === 'ru' ? '' : 'hidden'} rounded-[1rem] duration-200 focus:border-sky-500/60 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] rounded-tl-[0] bg-sky-200/10 border py-2 px-4 w-full outline-none text-sm ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500' : 'bg-white/60 border-sky-200/60 text-neutral-900 placeholder:text-neutral-400'}`} placeholder="RU description..." rows={6}></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {Array.from({ length: itemsLenght }).map((_, index) => (
                                    <Item key={index} cIndex={index} setItemsLenght={setItemsLenght} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 bg-neutral-900/90 backdrop-blur-md rounded-b-[28px] border-t border-white/10">
                        <button
                            onClick={() => { setIsOpen(false); setEditId(null); }}
                            type="button"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <GlassButton
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : editId ? "Update" : "Save"}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>

            <GlassModal open={gradientIsOpen} onClose={() => setGradientIsOpen(false)} title="gradient">
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-16">
                    {colors.map((color, index) => (
                        <GradientColor
                            key={index}
                            index={index}
                            color={color}
                            onChange={(newColor: string) => handleColorChange(index, newColor)}
                            onRemove={() => handleRemoveColor(index)}
                            canDelete={colors.length > 1}
                        />
                    ))}
                    <GlassButton onClick={handleAddColor} type="button">+</GlassButton>
                </div>
                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 bg-neutral-900/90 backdrop-blur-md rounded-b-[28px] border-t border-white/10">
                    <button onClick={() => setGradientIsOpen(false)} type="button" className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                    <GlassButton onClick={handleSaveGradient} type="button" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95">Save</GlassButton>
                </div>
            </GlassModal>

            <GlassModal open={discountOpen} onClose={() => setDiscountOpen(false)} title='Discount' size="3xl">
                <div className="max-h-[65vh] overflow-y-auto pb-16">
                    <Discount setDiscountId={setDiscountId} discountId={discountId} />
                </div>
                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 bg-neutral-900/90 backdrop-blur-md rounded-b-[28px] border-t border-white/10">
                    <button onClick={() => setDiscountOpen(false)} type="button" className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Close</button>
                    <GlassButton onClick={() => setDiscountOpen(false)} type="button" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95">Save</GlassButton>
                </div>
            </GlassModal>

            <GlassModal open={categoryOpen} onClose={() => setCategoryOpen(false)} title='Category' size="full">
                <div className="max-h-[70vh] overflow-y-auto pb-16">
                    <Category setCategoryId={setCategoryId} categoryId={categoryId} />
                </div>
                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 bg-neutral-900/90 backdrop-blur-md rounded-b-[28px] border-t border-white/10">
                    <button onClick={() => setCategoryOpen(false)} type="button" className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Close</button>
                    <GlassButton onClick={() => setCategoryOpen(false)} type="button" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95">Save</GlassButton>
                </div>
            </GlassModal>

            <GlassModal open={warehouseOpen} onClose={() => setWarehouseOpen(false)} title='Warehouse' size="3xl">
                <div className="max-h-[65vh] overflow-y-auto pb-16">
                    <WarehousePage setWarehouseId={setWarehouseId} warehouseId={warehouseId} />
                </div>
                <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 bg-neutral-900/90 backdrop-blur-md rounded-b-[28px] border-t border-white/10">
                    <button onClick={() => setWarehouseOpen(false)} type="button" className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Close</button>
                    <GlassButton onClick={() => setWarehouseOpen(false)} type="button" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95">Save</GlassButton>
                </div>
            </GlassModal>

            <GlassModal title="Delete product" open={!!deleteModal} onClose={() => setDeleteModal(null)}>
                <div className="space-y-4 pb-12">
                    <p className="text-sm text-neutral-300">Haqiqatan ham bu mahsulotni o'chirib yubormoqchimisiz?</p>
                    <div className="z-[999] flex items-center justify-end gap-3 absolute bottom-0 left-0 w-full p-6 bg-neutral-900/90 backdrop-blur-md rounded-b-[28px] border-t border-white/10">
                        <button onClick={() => setDeleteModal(null)} type="button" className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-zinc-300">Cancel</button>
                        <button onClick={() => { if (deleteModal) { handleDeleteProduct(deleteModal); setDeleteModal(null); } }} type="button" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20">Delete</button>
                    </div>
                </div>
            </GlassModal>
        </div>
    );
};

export default ProductsGet;