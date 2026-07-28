import { useRef, useState } from "react";

const SKILL_LIST = [
  { id: "unity", icon: "U", name: "Unity Engine", rank: "RANK 10/20", role: "VFX Graph & URP 2D", desc: "Top-down VFX, dissolve shaders, portal systems, and depth sorting." },
  { id: "shadergraph", icon: "SG", name: "Shader Graph", rank: "RANK 18/20", role: "HLSL & Custom Nodes", desc: "Procedural distortion, material effects, and screen-space post processing." },
  { id: "ae", icon: "Ae", name: "After Effects", rank: "RANK 19/20", role: "Motion Design & FX", desc: "Stylized motion graphics, particle bursts, compositing, and timing." },
  { id: "blender", icon: "B", name: "Blender 3D", rank: "RANK 15/20", role: "3D Asset Modeling", desc: "Low-poly assets, particle simulation, and mesh VFX." },
  { id: "fmod", icon: "F", name: "FMOD Studio", rank: "RANK 12/20", role: "Interactive Audio FX", desc: "Dynamic audio parameter routing and sound effect integration." },
  { id: "photoshop", icon: "Ps", name: "Photoshop", rank: "RANK 16/20", role: "Texture Paint & UI", desc: "Texture maps, alpha masks, splatters, and interface assets." },
];

export default function SkillSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const lockRef = useRef(false);
  const activeSkill = SKILL_LIST[activeIndex];

  const moveSkill = (step) => {
    const nextIndex = activeIndex + step;
    if (lockRef.current || nextIndex < 0 || nextIndex >= SKILL_LIST.length) return false;
    lockRef.current = true;
    setDirection(step > 0 ? "next" : "previous");
    setIsAnimating(true);
    setActiveIndex(nextIndex);
    window.setTimeout(() => {
      lockRef.current = false;
      setIsAnimating(false);
    }, 520);
    return true;
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      if (moveSkill(1)) event.preventDefault();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (moveSkill(-1)) event.preventDefault();
    }
  };

  const handleWheel = (event) => {
    const step = event.deltaY > 0 ? 1 : -1;
    if (moveSkill(step)) event.preventDefault();
  };

  return (
    <div ref={carouselRef} className="skill-carousel" tabIndex="0" onKeyDown={handleKeyDown} onWheel={handleWheel} aria-label="Software skills carousel">
      <img className="skill-hand-background" src="/Image/handfix_trimmed.png" alt="" aria-hidden="true" />
      <div className="skill-carousel__readout">
        <span className="skill-carousel__eyebrow">RANK / {String(activeIndex + 1).padStart(2, "0")}</span>
        <div className="skill-carousel__icon" aria-hidden="true">{activeSkill.icon}</div>
        <h4>{activeSkill.name}</h4>
        <span>{activeSkill.role}</span>
        <p>{activeSkill.desc}</p>
      </div>

      <div className="skill-carousel__main">
        <div className="skill-carousel__header">
          <span>CAPABILITIES MATRIX //</span>
          <h3>SOFTWARE &amp; TOOLS</h3>
        </div>
        <div className="skill-carousel__viewport" data-direction={direction}>
          <article className={`skill-carousel__card ${isAnimating ? "is-animating" : ""}`} key={activeSkill.id}>
            <span className="skill-carousel__card-icon" aria-hidden="true">{activeSkill.icon}</span>
            <div>
              <span className="skill-carousel__rank">{activeSkill.rank}</span>
              <h4>{activeSkill.name}</h4>
              <p>{activeSkill.role}</p>
            </div>
            <span className="skill-carousel__slash" aria-hidden="true" />
          </article>
        </div>
        <div className="skill-carousel__controls">
          <button type="button" onClick={() => moveSkill(-1)} disabled={activeIndex === 0} aria-label="Previous software">← PREV</button>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(SKILL_LIST.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => moveSkill(1)} disabled={activeIndex === SKILL_LIST.length - 1} aria-label="Next software">NEXT →</button>
        </div>
        <p className="skill-carousel__hint">SCROLL / ARROW KEYS TO CYCLE</p>
      </div>
    </div>
  );
}
