import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import NoiseBackground from "./components/NoiseBackground";
import Hero from "./components/Hero";
import StickyMenu from "./components/StickyMenu";
import Section from "./components/Section";
import TransitionOverlay from "./components/TransitionOverlay";
import BackToTop from "./components/BackToTop";
import ProjectExplorer from "./components/ProjectExplorer";
import SkillSection from "./components/SkillSection";
import { OverlayContext } from "./OverlayContext";
import VfxReel from "./components/VfxReel";
import ContactSection from "./components/ContactSection";
import AboutSection from "./components/AboutSection";
import "./App.css";

gsap.registerPlugin(ScrollToPlugin);

export default function App() {
  const [noiseMode, setNoiseMode] = useState("default");
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const overlayRef = useRef(null);

  const handleNavigate = (id, label) => {
    setNoiseMode(id === "contact" ? "event" : "hover");
    if (overlayRef.current) {
      overlayRef.current.play(label || id.toUpperCase());
    }
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `#${id}` },
      ease: "power3.inOut",
    });
  };

  return (
    <OverlayContext.Provider value={overlayRef}>
      <NoiseBackground mode={noiseMode} />
      <TransitionOverlay ref={overlayRef} />
      <StickyMenu onModeChange={setNoiseMode} />
      <BackToTop />

      <Hero onNavigate={handleNavigate} onHoverItem={setNoiseMode} />

      <main>
        <Section
          id="about"
          title="ABOUT"
          onMouseEnter={() => setIsAboutHovered(true)}
          onMouseLeave={() => setIsAboutHovered(false)}
        >
          <AboutSection isHovered={isAboutHovered} />
        </Section>

        <Section id="work" title="WORK">
          <ProjectExplorer />
          <VfxReel />
        </Section>

        <Section id="skill" title="SKILL">
          <SkillSection />
        </Section>

        <Section id="contact" title="CONTACT">
          <ContactSection />
        </Section>
      </main>
    </OverlayContext.Provider>
  );
}