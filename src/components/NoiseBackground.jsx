import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * NoiseBackground - Metaphor ReFantazio Style Rough Noise, Paint Splatters, Random Shapes & Grain
 */

export default function NoiseBackground() {
  const turbulenceRef = useRef(null);

  // Animated seed for rough noise grain effect
  useEffect(() => {
    const state = { seed: 1, freq: 0.4 };
    const anim = gsap.to(state, {
      seed: 30,
      freq: 0.55,
      duration: 90,        // dari 28s -> 90s, jauh lebih calm
      repeat: -1,
      yoyo: true,           // gak loncat balik ke 1 tiba-tiba, jadi ngalir pelan
      ease: "sine.inOut",
      onUpdate: () => {
        if (turbulenceRef.current) {
          turbulenceRef.current.setAttribute("seed", state.seed.toFixed(1));
          turbulenceRef.current.setAttribute("baseFrequency", state.freq.toFixed(3));
        }
      },
    });
    return () => anim.kill();
  }, []);

  return (
    <div className="noise-bg">
      {/* Base Rough Dark Background */}
      <div className="noise-bg__base" />

      {/* Random Metaphor Graphic Shape Overlay */}
      <div className="noise-bg__shapes">
        <img src="/Image/shape_circle.png" alt="Shape Circle" className="rand-shape shape-c1" />
        <img src="/Image/shape_circle2.png" alt="Shape Circle 2" className="rand-shape shape-c2" />
        <img src="/Image/shape_circle3.png" alt="Shape Circle 3" className="rand-shape shape-c3" />
        <img src="/Image/shape_1per4circlewfill.png" alt="Shape 1/4 Circle" className="rand-shape shape-q1" />
      </div>

      {/* Solid Metaphor Teal Paint Block Accent (NO GRADIENT) */}
      <div className="metaphor-paint-block teal-block" />

      {/* Metaphor Random Graphic Lines & HUD Overlay */}
      <svg className="metaphor-lines-overlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {/* Diagonal Dynamic Slash Lines */}
        <line x1="-100" y1="200" x2="2000" y2="700" stroke="#dedede" strokeWidth="1" strokeDasharray="12 8" opacity="0.2" />
        <line x1="-50" y1="230" x2="2050" y2="730" stroke="#169fa5" strokeWidth="2" opacity="0.35" />
        <line x1="300" y1="-100" x2="1600" y2="1200" stroke="#dedede" strokeWidth="1" opacity="0.15" />
        <line x1="0" y1="880" x2="1920" y2="400" stroke="#e43558" strokeWidth="1.5" strokeDasharray="20 10" opacity="0.3" />

        {/* Dynamic HUD Target Arcs & Circles */}
        <g transform="translate(1550, 260)">
          <circle cx="0" cy="0" r="220" stroke="#dedede" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="8 6" />
          <circle cx="0" cy="0" r="180" stroke="#169fa5" strokeWidth="1.5" fill="none" opacity="0.35" />
          <circle cx="0" cy="0" r="40" stroke="#e43558" strokeWidth="2" fill="none" opacity="0.4" />
          <line x1="-240" y1="0" x2="240" y2="0" stroke="#dedede" strokeWidth="1" opacity="0.25" />
          <line x1="0" y1="-240" x2="0" y2="240" stroke="#dedede" strokeWidth="1" opacity="0.25" />
          <text x="50" y="-190" fill="#dedede" fontSize="13" fontFamily="Frontage" letterSpacing="3" opacity="0.45">ARCHETYPE TREE // SYSTEM</text>
        </g>

        {/* Metaphor Top Right / Bottom Left HUD Ticks & Text */}
        <g transform="translate(80, 100)" opacity="0.35">
          <line x1="0" y1="0" x2="250" y2="0" stroke="#dedede" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="150" stroke="#dedede" strokeWidth="2" />
          <text x="15" y="30" fill="#dedede" fontSize="12" fontFamily="Frontage" letterSpacing="4">SYS.METAPHOR // 0.94</text>
        </g>

        <g transform="translate(140, 980)" opacity="0.4">
          <text x="0" y="0" fill="#169fa5" fontSize="14" fontFamily="Frontage" letterSpacing="5">MAG 86,092 // MONEY 755,371</text>
          <line x1="0" y1="12" x2="400" y2="12" stroke="#169fa5" strokeWidth="1.5" />
        </g>
      </svg>

      {/* PNG Grain Texture Overlay (shape_noise.png) */}
      <div
        className="noise-png-overlay"
        style={{ backgroundImage: `url('/Image/shape_noise.png')` }}
      />

      {/* Rough SVG Noise Grain Filter */}
      <svg className="noise-bg__grain" xmlns="http://www.w3.org/2000/svg">
        <filter id="metaphorRoughNoise">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.92"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.4" />
            <feFuncG type="linear" slope="1.4" />
            <feFuncB type="linear" slope="1.4" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#metaphorRoughNoise)" />
      </svg>
    </div>
  );
}
