import React, { useState, useEffect, useRef } from 'react';
import BIRDS from 'vanta/dist/vanta.birds.min';
import * as THREE from 'three';

const VantaBackground = () => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(BIRDS({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyrocontrols: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                backgroundColor: 0x0,

                // --- SỬA LẠI 3 DÒNG NÀY ---
                color1: 0x2c00ff, // Màu xanh tím (Blue/Purple)
                color2: 0xff8c00, // Màu cam (Orange)
                colorMode: 'varianceGradient', // Quay lại chế độ Gradient
                // -------------------------

                birdSize: 1.00,
                wingSpan: 30.00,
                separation: 25.00,
                alignment: 20.00,
                cohesion: 20.00,
                quantity: 5.00
            }));
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div ref={vantaRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        </div>
    );
};

export default VantaBackground;