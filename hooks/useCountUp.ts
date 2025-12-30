"use client";

import { useEffect, useState } from "react";

export const useCountUp = (endVal: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out expo
            const easeOutExpo = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            };

            const currentCount = Math.floor(easeOutExpo(percentage) * endVal);
            setCount(currentCount);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(endVal);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [endVal, duration]);

    return count;
};
