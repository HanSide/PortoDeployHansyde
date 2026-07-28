import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";


/**
 * TransitionOverlay - Metaphor ReFantazio Player Turn Encounter Transition
 * Features:
 * - Moon 5-frame flipbook sequence: shape_moon5.png -> shape_moon4.png -> shape_moon3.png -> shape_moon2.png -> shape_moon1.png.
 * - Clean, high-contrast moon and paint-splash composition.
 * - Smooth intro spawn AND dynamic slash-cut outro exit animation.
 */
const MOON_FRAMES = [
  "/Image/shape_moon5.png",
  "/Image/shape_moon4.png",
  "/Image/shape_moon3.png",
  "/Image/shape_moon2.png",
  "/Image/shape_moon1.png",
];

const TransitionOverlay = forwardRef((_, ref) => {
  const overlayRef = useRef(null);
  const ringRef = useRef(null);
  const titleRef = useRef(null);
  const activeTl = useRef(null);
  const isLockedRef = useRef(false);
  const suppressUntilRef = useRef(0);
  const cleanupFnRef = useRef(null);
  const [moonFrameIndex, setMoonFrameIndex] = useState(0);

  // Kalo component ke-unmount di tengah animasi (misal fast route/hot reload),
  // pastiin listener & tween-nya beneran mati, gak nyangkut selamanya.
  useEffect(() => {
    return () => {
      cleanupFnRef.current?.();
      activeTl.current?.kill();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    play(title, { suppressFor = 0 } = {}) {
      if (isLockedRef.current || Date.now() < suppressUntilRef.current) {
        return Promise.resolve(false);
      }

      isLockedRef.current = true;
      suppressUntilRef.current = Date.now() + suppressFor;

      // Defensive reset: bunuh tween lama & interval lama sebelum mulai yang baru,
      // biar moon/ring SELALU start dari state bersih walau ada spam sebelumnya.
      activeTl.current?.kill();
      cleanupFnRef.current?.();
      gsap.killTweensOf([
        overlayRef.current,
        ringRef.current,
        ".transition-moon-wrap",
        ".transition-teal-beam",
        ".transition-title-box",
        ".transition-shard",
        ".transition-moon-splash",
      ]);
      setMoonFrameIndex(0);

      return new Promise((resolve) => {
        if (titleRef.current) {
          titleRef.current.textContent = title || "PLAYER TURN";
        }

        const blockScroll = (event) => {
          if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key) || event.type !== "keydown") {
            event.preventDefault();
          }
        };
        document.addEventListener("wheel", blockScroll, { passive: false, capture: true });
        document.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
        document.addEventListener("keydown", blockScroll, { capture: true });

        let frameCount = 0;
        const frameInterval = setInterval(() => {
          setMoonFrameIndex((prev) => (prev + 1) % MOON_FRAMES.length);
          frameCount++;
          if (frameCount >= 12) clearInterval(frameInterval);
        }, 80);

        const cleanup = () => {
          clearInterval(frameInterval);
          document.removeEventListener("wheel", blockScroll, true);
          document.removeEventListener("touchmove", blockScroll, true);
          document.removeEventListener("keydown", blockScroll, true);
          isLockedRef.current = false;
          cleanupFnRef.current = null;
        };
        cleanupFnRef.current = cleanup;

        const tl = gsap.timeline({
          onComplete: () => {
            activeTl.current = null;
            window.setTimeout(() => {
              cleanup();
              resolve(true);
            }, 450);
          },
        });
        activeTl.current = tl;

        // Intro (Spawn) Animation
        tl.set(overlayRef.current, { autoAlpha: 1 })
          .set(ringRef.current, { rotation: 0, opacity: 1 })
          .set(".transition-moon-wrap", { xPercent: -50, scale: 0.5, opacity: 0, rotation: -15, transformOrigin: "center center" })
          .set(".transition-moon-img", { autoAlpha: 1 })
          .set(".transition-teal-beam", { scaleX: 0, transformOrigin: "left center" })
          .set(".transition-title-box", { opacity: 0, x: -80, skewX: -10 })
          .set(".transition-shard", { opacity: 0, scale: 0.3 })
          .set(".transition-moon-splash", { opacity: 0, scale: 0.15, x: 0, y: 0 });

        tl.to(ringRef.current, {
          rotation: "+=360",
          duration: 1.4,
          ease: "power2.inOut",
        }, 0)
        .to(".transition-moon-wrap", {
          xPercent: -50,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.45,
          ease: "back.out(1.8)",
        }, 0)
        .to(".transition-teal-beam", {
          scaleX: 1,
          duration: 0.35,
          ease: "power4.out",
        }, 0.1)
        .to(".transition-title-box", {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: 0.35,
          ease: "power3.out",
        }, 0.2)
        .to(".transition-shard", {
          opacity: 1,
          scale: 1,
          stagger: 0.04,
          duration: 0.3,
        }, 0.25)
        .to(".transition-moon-splash", {
          opacity: 0.9,
          scale: 1,
          x: (index) => [120, -145, 175, -110, 55][index],
          y: (index) => [-75, -48, 65, 100, -135][index],
          rotation: (index) => [70, -50, 140, -110, 25][index],
          stagger: 0.035,
          duration: 0.65,
          ease: "none",
        }, 0.16)

        // Hold frame brief moment
        .to({}, { duration: 0.35 })

        // Outro (Slash Cut Exit Animation)
        .to(".transition-teal-beam", {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.3,
          ease: "power4.in",
        })
        .to(".transition-title-box", {
          x: 100,
          opacity: 0,
          duration: 0.25,
          ease: "power3.in",
        }, "<")
        .to(".transition-moon-wrap", {
          scale: 1.3,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        }, "<")
        .to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in",
        }, "-=0.1");
      });
    },
    isBusy() {
      return isLockedRef.current || Date.now() < suppressUntilRef.current;
    },
  }));

  return (
    <div ref={overlayRef} className="transition-overlay">
      {/* Top Moon 5-Frame Flipbook & Rotating Ring */}
      <div className="transition-moon-wrap">
        <div ref={ringRef} className="transition-ring-outer">
          <svg viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" stroke="#dedede" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="10 6" />
            <circle cx="150" cy="150" r="110" stroke="#169fa5" strokeWidth="2.5" fill="none" opacity="0.8" />
            <circle cx="150" cy="150" r="80" stroke="#e43558" strokeWidth="1.5" fill="none" opacity="0.5" />
          </svg>
        </div>
        <img
          src={MOON_FRAMES[moonFrameIndex]}
          alt="Metaphor Moon Flipbook"
          className="transition-moon-img"
        />
      </div>

      {/* Diagonal Teal Slash Beam (#169fa5) */}
      <div className="transition-teal-beam">
        <div className="beam-slash-line" />
      </div>

      {/* Main Title Banner */}
      <div className="transition-title-box">
        <span className="transition-subtitle">STAGE TRANSMISSION //</span>
        <h2 ref={titleRef} className="transition-title">
          PLAYER TURN
        </h2>
      </div>

      {/* Floating Shards & Aesthetic Sketch Lines */}
      <div className="transition-shards-container">
        <div className="transition-moon-splash moon-splash-1" />
        <div className="transition-moon-splash moon-splash-2" />
        <div className="transition-moon-splash moon-splash-3" />
        <div className="transition-moon-splash moon-splash-4" />
        <div className="transition-moon-splash moon-splash-5" />
        <div className="transition-shard shard-1" />
        <div className="transition-shard shard-2" />
        <div className="transition-shard shard-3" />
        <div className="transition-shard shard-4" />
        <svg className="transition-sketch-lines" viewBox="0 0 1920 1080">
          <line x1="0" y1="200" x2="1920" y2="800" stroke="#dedede" strokeWidth="1.5" opacity="0.3" strokeDasharray="15 10" />
          <line x1="200" y1="0" x2="1700" y2="1080" stroke="#169fa5" strokeWidth="2" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
});

export default TransitionOverlay;
