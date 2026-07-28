import { useState } from "react";
import { PROJECTS } from "../data/projects";

/**
 * ProjectExplorer - Metaphor Photo 3 Equipment Menu Layout
 * - Left side: Equipment style project list with RANK badges & stats.
 * - Right side: editorial project transmission with live metadata and external play link.
 */
export default function ProjectExplorer() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  return (
    <div className="equipment-work-layout">
      {/* Left Side: Equipment Project Cards List */}
      <div className="equipment-list-col">
        <ul className="equipment-list">
          {PROJECTS.map((project, idx) => {
            const isActive = activeProject.id === project.id;
            const rankNum = String(idx + 1).padStart(2, "0");
            return (
              <li
                key={project.id}
                className={`equipment-item ${isActive ? "is-active" : ""}`}
                onMouseEnter={() => setActiveProject(project)}
                onClick={() => setActiveProject(project)}
              >
                {isActive && <div className="equipment-brush-banner" />}
                
                <div className="equipment-item-inner">
                  <div className="equipment-meta">
                    <span className="equipment-title">{project.title}</span>
                    <span className="equipment-role">{project.role}</span>
                  </div>

                  <div className="equipment-stats">
                    <div className="stat-badge">
                      <span className="stat-label">RANK</span>
                      <span className="stat-val">{rankNum}/20</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Project Description Panel */}
        <div className="equipment-desc-box">
          <h4 className="desc-title">PROJECT SPECIFICATIONS //</h4>
          <p className="desc-text">{activeProject.description}</p>
          <div className="tools-tags">
            {activeProject.tools.map((tool) => (
              <span key={tool} className="tool-chip">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Project transmission. Intentionally no orb graphic. */}
      <div className="equipment-preview-col">
        <article className="project-transmission" key={activeProject.id}>
          <div className="project-transmission__topline">
            <span>TRANSMISSION / {activeProject.id.toUpperCase()}</span>
            <span>{activeProject.date}</span>
          </div>
          <div className="project-transmission__image">
            <img src={activeProject.images[0]} alt={`${activeProject.title} project`} />
            <span className="project-transmission__scan" aria-hidden="true" />
          </div>
          <div className="project-transmission__copy">
            <span className="project-transmission__status">{activeProject.status}</span>
            <h4>{activeProject.title}</h4>
            <p>{activeProject.description}</p>
            <a href={activeProject.itchUrl} target="_blank" rel="noreferrer">PLAY ON ITCH.IO <span>→</span></a>
          </div>
          <div className="project-transmission__ticker" aria-hidden="true">
            <span>{`${activeProject.title} · ${activeProject.date} · ${activeProject.status} · `}</span>
            <span>{`${activeProject.title} · ${activeProject.date} · ${activeProject.status} · `}</span>
          </div>
        </article>
      </div>
    </div>
  );
}
