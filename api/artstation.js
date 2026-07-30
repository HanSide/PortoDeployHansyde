// /api/artstation.js
// Vercel Serverless Function — fetches ArtStation project feed server-side.
//
// Why this exists: ArtStation has no official public API. The endpoint below
// (`/users/{username}/projects.json`) is what ArtStation's own frontend calls
// internally to render a profile page. It's unofficial, undocumented, and can
// change or break at any time — this function isolates that risk to one place
// and normalizes the response so the frontend never touches ArtStation's raw
// shape directly.

const ARTSTATION_USERNAME = "hanside";
const ARTSTATION_URL = `https://www.artstation.com/users/${ARTSTATION_USERNAME}/projects.json`;

// In-memory cache (persists per warm serverless instance, resets on cold start).
// This keeps us from hammering ArtStation on every visitor and reduces the
// blast radius if the endpoint ever starts rate-limiting or blocking us.
let cache = { data: null, timestamp: 0 };
const CACHE_TTL_MS = 1000 * 60 * 60 * 3; // 3 hours

function normalizeProject(raw) {
  return {
    id: raw.hash_id,
    title: raw.title,
    description: (raw.description || "").trim(),
    permalink: raw.permalink,
    publishedAt: raw.published_at,
    likes: raw.likes_count,
    thumbnail:
      raw.cover?.thumb_url ||
      raw.cover?.small_square_url ||
      raw.cover?.micro_square_image_url ||
      null,
    isVideo: Boolean(raw.icons?.video),
    tags: raw.tag_list || [],
  };
}

export default async function handler(req, res) {
  // Allow the browser to cache the response at the edge/CDN too.
  res.setHeader(
    "Cache-Control",
    "s-maxage=10800, stale-while-revalidate=86400"
  );

  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL_MS) {
    return res.status(200).json({ projects: cache.data, cached: true });
  }

  try {
    const response = await fetch(ARTSTATION_URL, {
      headers: {
        // A normal browser UA avoids some naive bot-blocking. This is a
        // best-effort header, not a guarantee ArtStation won't change behavior.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ArtStation responded with ${response.status}`);
    }

    const json = await response.json();
    const projects = (json.data || []).map(normalizeProject);

    cache = { data: projects, timestamp: now };

    return res.status(200).json({ projects, cached: false });
  } catch (error) {
    // If the fetch fails but we have a stale cache, serve that instead of
    // showing an empty section — better a slightly old reel than a broken one.
    if (cache.data) {
      return res.status(200).json({
        projects: cache.data,
        cached: true,
        stale: true,
      });
    }

    return res.status(502).json({
      error: "Failed to fetch ArtStation projects",
      detail: error.message,
    });
  }
}