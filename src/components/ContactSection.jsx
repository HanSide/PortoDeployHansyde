import { useState, useRef } from "react";

const SOCIALS = [
  { id: "email", label: "EMAIL", value: "hansydeee@gmail.com", href: "mailto:hansydeee@gmail.com" },
  { id: "instagram", label: "INSTAGRAM", value: "@r_hnnx", href: "https://www.instagram.com/r_hnnx/" },
  { id: "linkedin", label: "LINKEDIN", value: "hanside", href: "https://www.linkedin.com/in/hanside/" },
  { id: "artstation", label: "ARTSTATION", value: "hanside", href: "https://www.artstation.com/hanside" },
];

export default function ContactSection() {
  const [hoveredId, setHoveredId] = useState(null);
  const turbRef = useRef(null);

  const handleEnter = (id) => {
    setHoveredId(id);
    let seed = 1;
    const interval = setInterval(() => {
      seed = (seed % 99) + 1;
      turbRef.current?.setAttribute("seed", seed.toString());
    }, 60);
    // simpan interval id di elemen biar bisa dibersihin pas leave
    turbRef.current?.setAttribute("data-interval", interval);
  };

  const handleLeave = () => {
    setHoveredId(null);
    const interval = turbRef.current?.getAttribute("data-interval");
    if (interval) clearInterval(Number(interval));
  };

  return (
    <div className="contact-transmission">
      <svg className="contact-noise-filter" aria-hidden="true">
        <filter id="contactBrushDisplace">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* HUD Ring Kiri, motif konsisten sama Hero & TransitionOverlay */}
      <div className="contact-hud-ring" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" stroke="#dedede" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="6 4" />
          <circle cx="100" cy="100" r="66" stroke="#169fa5" strokeWidth="1.5" fill="none" opacity="0.55" />
          <circle cx="100" cy="100" r="34" stroke="#e43558" strokeWidth="2" fill="none" opacity="0.6" />
        </svg>
      </div>

      <div className="contact-copy">
        <span className="contact-eyebrow">TRANSMISSION // OPEN CHANNEL</span>
        <h4 className="contact-headline">
          Got a project that needs to <span className="contact-headline__accent">feel good on impact?</span>
        </h4>
        <p className="contact-note">
          Open for freelance, contract, or full-time role as VFX Artist or tech Artist.
        </p>
      </div>

      <ul className="contact-channels">
        {SOCIALS.map(({ id, label, value, href }) => {
          const isHovered = hoveredId === id;
          return (
            <li
              key={id}
              className={`contact-channel ${isHovered ? "is-hovered" : ""}`}
              onMouseEnter={() => handleEnter(id)}
              onMouseLeave={handleLeave}
            >
              {isHovered && <div className="contact-channel__brush" />}
              <a href={href} target={id === "email" ? undefined : "_blank"} rel="noreferrer" className="contact-channel__link">
                <span className="contact-channel__label">{label}</span>
                <span className="contact-channel__value">{value}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="contact-footer-line" aria-hidden="true">
        <span>HANSYDE © 2026</span>
        <span>JUST KEEP LEARNING SOMETHING NEW EVERYDAY //</span>
      </div>
    </div>
  );
}