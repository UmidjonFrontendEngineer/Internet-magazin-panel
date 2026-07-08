'use client';

export default function SimpleColorRange({ num }: { num: number }) {
    const logHexColor = (hue: number) => {
        const l = 0.5;
        const s = 1;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const k = (n + hue / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };

        const hex = `#${f(0)}${f(8)}${f(4)}`;
        console.log(hex);
    };

    return (
        <div className="max-[500px]:w-full w-1/2 flex">
            <input
                type="range"
                min="0"
                max="360"
                name={`range${num}`}
                defaultValue="220"
                onChange={(e) => logHexColor(Number(e.target.value))}
                className="w-full h-4 rounded-full appearance-none cursor-pointer bg-transparent
        [&::-webkit-slider-runnable-track]:rounded-full
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-5
        [&::-webkit-slider-thumb]:w-5
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:border-2
        [&::-webkit-slider-thumb]:border-slate-900
        [&::-webkit-slider-thumb]:shadow-md
        [&::-webkit-slider-thumb]:-mt-[2px]"
                style={{
                    background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
            />
        </div>
    );
}