# HanSyde Portfolio - Starter Scaffold

React + Vite + GSAP starter buat portfolio, sesuai brainstorming (Main Menu →
About / Work / Skill / Contact, scrollable single-page, chapter transition,
noise background dengan color mode).

## Cara jalanin

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Struktur

```
src/
  components/
    NoiseBackground.jsx   -> grain via SVG feTurbulence + tint layer (color mode)
    StickyMenu.jsx         -> menu ABOUT/WORK/SKILL/CONTACT, scroll-spy + smooth scroll
    ChapterTransition.jsx  -> title card yang muncul sekilas pas section masuk viewport
    Section.jsx            -> wrapper section, otomatis pasang ChapterTransition
  App.jsx                  -> assembling semua komponen + isi tiap section
  App.css                  -> semua styling
```

## Yang perlu lo ganti/lanjutin

1. **Font** - `App.css` masih pake `"Frontage"` sebagai nama font tapi belum
   di-load. Tambahin `@font-face` di `index.css` (atau import dari file lokal)
   buat Frontage, Juana, dan set Cambria sebagai fallback (Cambria udah aman
   karena web-safe/system font).
2. **Isi tiap Section** di `App.jsx` - masih placeholder text, tinggal ganti
   sama konten asli (project cards di Work, breakdown tools di Skill, dst).
3. **Noise color mode** - saat ini ada 3 mode: `default`, `hover` (merah),
   `event` (ungu, otomatis aktif pas section Contact dipilih). Tambah mode
   baru tinggal nambah entry di `MODE_COLORS` (NoiseBackground.jsx) dan
   trigger `onModeChange("nama_mode")` dari komponen manapun yang perlu.
4. **Chapter transition timing/style** - di `ChapterTransition.jsx`, atur
   ulang stagger/duration/easing sesuai selera, atau ganti jadi full custom
   SVG reveal kayak referensi title card SOLO lo.
5. **Equipment-style Work section** - belum diimplementasi, ini next step
   yang worth didahulukan karena itu section paling kompleks (stat list per
   game).

## Catatan teknis

- GSAP dan semua plugin (ScrollTrigger, ScrollToPlugin, SplitText) 100% gratis
  sejak April 2025 (disponsori Webflow), jadi gak perlu Club GreenSock
  membership.
- `useGSAP` dari `@gsap/react` dipake di ChapterTransition biar animasi
  auto-cleanup pas komponen unmount/re-render (penting di React, gak perlu
  dipikirin di vanilla JS).
