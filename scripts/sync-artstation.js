// scripts/sync-artstation.js
//
// Syncs ArtStation projects into src/data/artstation-projects.json.
//
// WHY THIS IS A LOCAL SCRIPT, NOT A LIVE API ROUTE:
// ArtStation's unofficial projects.json endpoint is protected by Cloudflare
// bot-detection that blocks datacenter IPs (Vercel included) with a 403 —
// even with a browser-like User-Agent. Requests from a normal home/ISP
// connection generally aren't blocked, which is why this runs locally
// instead of as a serverless function.
//
// USAGE:
//   node scripts/sync-artstation.js
//     → tries to fetch directly. Works if your local connection isn't blocked.
//
//   node scripts/sync-artstation.js --from-file path/to/raw.json
//     → use this if the direct fetch above also gets a 403.
//     Steps:
//       1. Open https://www.artstation.com/users/hanside/projects.json in
//          your own browser (while logged in or just as a normal visit).
//       2. Save the raw JSON response as a file, e.g. scripts/raw.json
//          (Ctrl+A, Ctrl+C the page content into a text file works fine).
//       3. Run: node scripts/sync-artstation.js --from-file scripts/raw.json
//
// Either way, output is written to src/data/artstation-projects.json and
// VfxReel.jsx reads that file directly at build time — no runtime fetch,
// no CORS, no Cloudflare block possible in production.

import { writeFileSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "src", "data", "artstation-projects.json");
const ARTSTATION_USERNAME = "hanside";
const ARTSTATION_URL = `https://www.artstation.com/users/${ARTSTATION_USERNAME}/projects.json`;

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

function writeOutput(rawJson) {
  const projects = (rawJson.data || [])
    .map(normalizeProject)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      { syncedAt: new Date().toISOString(), projects },
      null,
      2
    )
  );

  console.log(`✓ Synced ${projects.length} project(s) to ${OUTPUT_PATH}`);
}

async function main() {
  const fileFlagIndex = process.argv.indexOf("--from-file");

  if (fileFlagIndex !== -1) {
    const filePath = process.argv[fileFlagIndex + 1];
    if (!filePath || !existsSync(filePath)) {
      console.error(`✗ File not found: ${filePath}`);
      process.exit(1);
    }
    const rawJson = JSON.parse(readFileSync(filePath, "utf-8"));
    writeOutput(rawJson);
    return;
  }

  console.log(`Fetching ${ARTSTATION_URL} ...`);
  try {
    const response = await fetch(ARTSTATION_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ArtStation responded with ${response.status}`);
    }

    const rawJson = await response.json();
    writeOutput(rawJson);
  } catch (error) {
    console.error(`✗ Direct fetch failed: ${error.message}`);
    console.error("");
    console.error("This can happen even from a home connection sometimes.");
    console.error("Fallback: open this URL in your browser, save the response");
    console.error("as a .json file, then re-run with --from-file:");
    console.error("");
    console.error(`  ${ARTSTATION_URL}`);
    console.error("");
    console.error("  node scripts/sync-artstation.js --from-file scripts/raw.json");
    process.exit(1);
  }
}

main();