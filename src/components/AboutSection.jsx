import { useState, useEffect, useRef } from "react";

export default function AboutSection({ isHovered }) {
  const [hasSettled, setHasSettled] = useState(false);
  const frameRef = useRef(null);

  // Reset ke state "belum settle" tiap kali hover keluar,
  // biar pas hover masuk lagi urutannya balik dari awal (wbg dulu, baru crossfade).
  useEffect(() => {
    if (!isHovered) {
      setHasSettled(false);
    }
  }, [isHovered]);

  const handleSlideTransitionEnd = (event) => {
    // Cuma peduliin transisi "transform" (slide-nya), biar gak ke-trigger
    // oleh transition lain yang mungkin numpuk di elemen yang sama.
    if (event.propertyName === "transform" && isHovered) {
      setHasSettled(true);
    }
  };

  return (
    <div className={`about-transmission ${isHovered ? "is-hovered" : ""}`}>
      <div className="about-panel">
        <span className="about-panel__index">01 / QUICK DEFINITION FILE</span>
        <p>
          VFX Artist & Motion Designer focused on real-time shaders, particle systems, and high-impact stylized game visuals.
        </p>
        <div className="about-panel__lines" aria-hidden="true"><i /><i /><i /></div>
      </div>

      {/* Slot foto - geser masuk dari kiri pas section di-hover, lalu crossfade begitu settle */}
      <div className="about-photo-slot" aria-hidden="true">
        <div
          ref={frameRef}
          className="about-photo-frame"
          onTransitionEnd={handleSlideTransitionEnd}
        >
          {/* Versi during-slide: with background, keliatan selama foto masih bergerak */}
          <img
            src="/Image/fillpp.png"
            alt=""
            className={`about-photo-img about-photo-img--motion ${hasSettled ? "is-faded-out" : ""}`}
          />
          {/* Versi final: clean, fade-in begitu slide udah settle di posisi akhir */}
          <img
            src="/Image/fillwbgpp.png"
            alt=""
            className={`about-photo-img about-photo-img--settled ${hasSettled ? "is-faded-in" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}