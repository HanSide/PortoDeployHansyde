import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * BackToTop with Metaphor Photo 3 Confirmation Modal Overlay & Anticipation Animation
 */
export default function BackToTop() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("yes");
  const modalRef = useRef(null);
  const dialRef = useRef(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Anticipation Recoil Scale Animation
      gsap.fromTo(
        modalRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }
      );

      // Rotating Dial Ring
      gsap.to(dialRef.current, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          gsap.to(window, {
            duration: 1.1,
            scrollTo: { y: 0 },
            ease: "power3.inOut",
          });
        },
      });
    } else {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in Corner */}
      <button
        className="back-to-top"
        onClick={handleOpen}
        aria-label="Return to top"
      >
        <div className="back-to-top__ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="#dedede" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="4 3" />
            <circle cx="50" cy="50" r="36" stroke="#169fa5" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
        <span className="back-to-top__label">TOP</span>
      </button>

      {/* Photo 3 Metaphor Confirmation Overlay Modal */}
      {isOpen && (
        <div className="metaphor-modal-overlay" onClick={handleCancel}>
          <div ref={modalRef} className="metaphor-modal" onClick={(e) => e.stopPropagation()}>
            {/* Background Dial Ring (Photo 3 Motif - Rotating Animation) */}
            <div ref={dialRef} className="modal-dial-ring">
              <svg viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="180" stroke="#dedede" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="10 6" />
                <circle cx="200" cy="200" r="140" stroke="#169fa5" strokeWidth="3" fill="none" opacity="0.6" />
                <circle cx="200" cy="200" r="90" stroke="#e43558" strokeWidth="1.5" fill="none" opacity="0.4" />
                <path d="M200 10 L200 50 M200 350 L200 390 M10 200 L50 200 M350 200 L390 200" stroke="#dedede" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>

            {/* Horizontal Slash Line Cutting Across Screen */}
            <div className="modal-slash-line" />

            {/* Modal Title & Subtext */}
            <div className="modal-header">
              <h2 className="modal-title">TOP</h2>
              <p className="modal-subtitle">Ascend to the beginning of the page?</p>
            </div>

            {/* Yes / No Choices with #e43558 Brush Banner */}
            <div className="modal-choices">
              <button
                className={`modal-choice ${selectedOption === "yes" ? "is-active" : ""}`}
                onMouseEnter={() => setSelectedOption("yes")}
                onClick={handleConfirm}
              >
                {selectedOption === "yes" && <div className="modal-choice__brush" />}
                <span className="modal-choice__text">Yes</span>
              </button>

              <button
                className={`modal-choice ${selectedOption === "no" ? "is-active" : ""}`}
                onMouseEnter={() => setSelectedOption("no")}
                onClick={handleCancel}
              >
                {selectedOption === "no" && <div className="modal-choice__brush" />}
                <span className="modal-choice__text">No</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}