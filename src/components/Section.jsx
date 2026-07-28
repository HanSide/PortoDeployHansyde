import { useRef } from "react";

export default function Section({ id, title, children, onMouseEnter, onMouseLeave }) {
  const sectionRef = useRef(null);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`section section--${id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="section-atmosphere" aria-hidden="true">
        <svg className="section-atmosphere__lines" viewBox="0 0 1200 900" preserveAspectRatio="none">
          <path d="M-30 180 L1230 330 M120 860 L1080 -40 M-40 690 L1190 550" />
          <path d="M0 80 L1200 790" className="section-atmosphere__lines--dash" />
        </svg>
      </div>
      <div className="section__inner">
        <h3 className="section__label">{title}</h3>
        {children}
      </div>
    </section>
  );
}