import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const MENU_ITEMS = [
  { id: "about", label: "ABOUT", tag: "ORIGIN ∯ CREATOR PROFILE", rot: -3, shift: 0 },
  { id: "work", label: "WORK", tag: "ARCHIVE ∯ SELECTED PROJECTS", rot: 2, shift: 3 },
  { id: "skill", label: "SKILL", tag: "CAPABILITIES ∯ VFX & SHADERS", rot: -2.5, shift: 1 },
  { id: "contact", label: "CONTACT", tag: "TRANSMISSION ∯ GET IN TOUCH", rot: 1.5, shift: 4 },
];

export default function Hero({ onNavigate, onHoverItem }) {
  const containerRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const hoverTurbRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".hero-menu__item", {
        xPercent: -120,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power4.out",
      });

      // Rotating HUD Outer Ring ONLY
      gsap.to(".hero-hud__ring-svg", {
        rotation: 360,
        duration: 45,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  // Live noise animation when menu item is hovered
  useEffect(() => {
    if (!hoveredId) return;

    let seed = 1;
    const interval = setInterval(() => {
      seed = (seed % 99) + 1;
      if (hoverTurbRef.current) {
        hoverTurbRef.current.setAttribute("seed", seed.toString());
        hoverTurbRef.current.setAttribute("baseFrequency", `${0.04 + (seed % 4) * 0.005}`);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [hoveredId]);

  const handleMouseEnter = (id) => {
    setHoveredId(id);
    if (onHoverItem) onHoverItem("hover");
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    if (onHoverItem) onHoverItem("default");
  };

  return (
    <section id="hero" className="hero" ref={containerRef}>
      {/* Dynamic SVG Filter for Live Animated Hover Brush & Noise Distortion */}
      <svg className="svg-filters" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="paintBrushDisplace">
            <feTurbulence ref={hoverTurbRef} type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Main Diagonal Metaphor Typography Menu */}
      <div className="hero-content">
        <ul className="hero-menu">
          {MENU_ITEMS.map(({ id, label, tag, rot, shift }, index) => {
            const isHovered = hoveredId === id;
            return (
              <li
                key={id}
                className={`hero-menu__item ${isHovered ? "is-hovered" : ""}`}
                style={{
                  transform: `rotate(${rot}deg) translateX(${shift}vw)`,
                  zIndex: isHovered ? 10 : 5 - index,
                }}
                onMouseEnter={() => handleMouseEnter(id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Solid Paint Brush Banner (#e43558) with Live Jitter Noise */}
                <div className="hero-menu__brush-bg">
                  <div className="brush-stroke" />
                  <div className="brush-splatters">
                    <span className="splatter s-1" />
                    <span className="splatter s-2" />
                    <span className="splatter s-3" />
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(id, label)}
                  className="hero-menu__button"
                >
                  <span className="hero-menu__text" data-text={label}>
                    {label}
                  </span>
                  <span className="hero-menu__tag">{tag}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Metaphor HUD Target Ring with STATIC Center Archtree PNG */}
      <div className="hero-hud">
        <div className="hero-hud__ring">
          {/* Rotating Outer Ring SVG */}
          <div className="hero-hud__ring-svg">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="92" stroke="#dedede" strokeWidth="1" fill="none" opacity="0.25" strokeDasharray="6 4" />
              <circle cx="100" cy="100" r="76" stroke="#169fa5" strokeWidth="3" fill="none" opacity="0.6" />
              <circle cx="100" cy="100" r="60" stroke="#e43558" strokeWidth="2" fill="none" opacity="0.7" />
              <path d="M100 5 L100 25 M100 175 L100 195 M5 100 L25 100 M175 100 L195 100" stroke="#dedede" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>

          {/* STATIC Center Archtree Image (Does NOT Rotate!) */}
          <div className="hero-hud__center-archtree">
            <img src="/Image/archtree_trimmed.png" alt="Archetree Center" className="hud-archtree-img" />
          </div>
        </div>

        <div className="hero-hud__label">
          <span className="hud-icon">▲</span>
          <span className="hud-text">ARCHETYPE TREE</span>
        </div>
      </div>
    </section>
  );
}