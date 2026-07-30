import { useEffect, useState } from "react";

/**
 * VfxReel - live feed synced from ArtStation.
 * Data comes from /api/artstation (a Vercel serverless function that
 * fetches ArtStation's unofficial projects.json endpoint server-side).
 * This avoids CORS issues and keeps the unofficial-endpoint risk contained
 * to one backend file instead of the browser.
 */
export default function VfxReel() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    async function loadReel() {
      try {
        const res = await fetch("/api/artstation");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setProjects(json.projects || []);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) setStatus("error");
      }
    }

    loadReel();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="vfx-reel">
      <div className="vfx-reel__header">
        <span>REEL ARCHIVE //</span>
        <h4>VFX</h4>
      </div>

      {status === "loading" && (
        <p className="vfx-reel__status">Syncing from ArtStation...</p>
      )}

      {status === "error" && (
        <p className="vfx-reel__status">
          Couldn't reach the ArtStation feed right now — check back later.
        </p>
      )}

      {status === "ready" && projects.length === 0 && (
        <p className="vfx-reel__status">No published projects yet.</p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="vfx-reel__grid">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.permalink}
              target="_blank"
              rel="noreferrer"
              className="vfx-reel__card"
              style={{ "--card-accent": "var(--color-accent)" }}
            >
              {project.thumbnail && (
                <div className="vfx-reel__thumb">
                  <img src={project.thumbnail} alt={project.title} loading="lazy" />
                  {project.isVideo && <span className="vfx-reel__badge">▶</span>}
                </div>
              )}
              <span className="vfx-reel__tag">
                {new Date(project.publishedAt).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <h5>{project.title}</h5>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}