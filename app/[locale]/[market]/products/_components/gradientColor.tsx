'use client';
import React, { useState } from "react";

interface ColorPickerProps {
    num: number;
    onChangeColor: (index: number, color: string) => void;
}

const ColorPicker = ({ num, onChangeColor }: ColorPickerProps) => {
    const [currentColor, setCurrentColor] = useState("#3b82f6");

    const handleChange = (newColor: string) => {
        setCurrentColor(newColor);
        onChangeColor(num, newColor);
    };

    return (
        <div className="w-full flex items-center justify-between gap-4 py-2 px-4 rounded-xl border border-white/10 bg-white/5">
            <span className="text-xs font-semibold text-neutral-300 w-24">Rang {num + 1}:</span>

            <div className="flex items-center gap-3 flex-1 justify-end">
                <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="#000000"
                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-200 w-28 uppercase font-mono tracking-wider focus:outline-none focus:border-sky-500"
                />

                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 cursor-pointer shadow-sm shrink-0">
                    <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleChange(e.target.value)}
                        className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                    />
                    <div
                        className="w-full h-full pointer-events-none"
                        style={{ backgroundColor: currentColor }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ColorPicker;