'use client';
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const GradientColor = ({ index, gradientsLength, setGradientsLength }: { index: number, gradientsLength: number, setGradientsLength: React.Dispatch<React.SetStateAction<number>> }) => {
    const [color, setColor] = useState("#3b82f6");

    return (
        <div className="w-full flex items-center justify-between gap-4 py-2 px-4 rounded-xl border border-white/10 bg-white/5">
            <input type="hidden" name={`gradient-${index}`} value={color} />

            <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-semibold text-neutral-300 w-16">Rang {index + 1}:</span>

                <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-200 w-24 uppercase font-mono"
                />

                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 cursor-pointer">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                    />
                    <div
                        className="w-full h-full pointer-events-none"
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>

            {gradientsLength > 1 && (
                <button
                    type="button"
                    onClick={() => setGradientsLength(prev => prev - 1)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition shrink-0"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default GradientColor;