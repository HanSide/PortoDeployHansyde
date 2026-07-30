import artstationData from "../data/artstation-projects.json";

/**
 * VfxReel - shows the ArtStation reel from a static, locally-synced file.
 *
 * Why static instead of a live fetch: ArtStation's unofficial projects.json
 * endpoint blocks datacenter IPs (including Vercel's) with a 403, so a
 * runtime fetch from production always fails. Instead, run
 * `node scripts/sync-artstation.js` locally whenever there's a new upload,
 * commit the updated src/data/artstation-projects.json, and redeploy.
 * Not real-time, but it never breaks in production.
 */
export default function VfxReel() {
  const projects = artstationData.projects || [];

  return (
    <div className="vfx-reel">
      <div className="vfx-reel__header">
        <span>REEL ARCHIVE //</span>
        <h4>VFX</h4>
      </div>

      {projects.length === 0 ? (
        <p className="vfx-reel__status">No synced projects yet.</p>
      ) : (
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