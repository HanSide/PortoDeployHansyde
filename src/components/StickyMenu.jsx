import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ITEMS = [

];

export default function StickyMenu({ onModeChange }) {
  const [active, setActive] = useState("about");
  const [isPastHero, setIsPastHero] = useState(false);
  const menuRef = useRef(null);

  // Scroll-spy: watch each section, highlight menu item currently in view
  useEffect(() => {
    const triggers = ITEMS.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      })
    );
    const heroTrigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top",
      onEnter: () => setIsPastHero(true),
      onLeaveBack: () => setIsPastHero(false),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      heroTrigger.kill();
    };
  }, []);

  const handleClick = (id) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `#${id}`, offsetY: 0 },
      ease: "power3.inOut",
    });
    // CONTACT acts as our demo "special event" -> purple noise
    onModeChange(id === "contact" ? "event" : "default");
  };

  return (
    <nav ref={menuRef} className="sticky-menu">
      <div className={`sticky-chapter ${isPastHero ? "is-visible" : ""}`} aria-live="polite">
        <span key={active}>// {active}</span>
      </div>
      <ul>
        {ITEMS.map(({ id, label }) => (
          <li key={id}>
            <button
              className={active === id ? "is-active" : ""}
              onClick={() => handleClick(id)}
              onMouseEnter={() => onModeChange("hover")}
              onMouseLeave={() => onModeChange(active === "contact" ? "event" : "default")}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
