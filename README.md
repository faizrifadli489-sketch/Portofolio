# Orbit — Portofolio 3D bertema Interstellar

Portofolio pribadi dengan latar black hole real-time (Three.js / React Three Fiber): accretion
disk shader kustom, photon ring yang selalu menghadap kamera, starfield berlapis, dan kamera yang
turun mengikuti scroll.

## Stack

- **Vite 5** + **React 18**
- **Three.js** via **@react-three/fiber**
- CSS murni (tanpa framework), font Space Grotesk + JetBrains Mono
- Tanpa aset gambar — semua visual dibuat di GPU

## Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output ke dist/
npm run preview
```

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo tersebut.
3. Framework terdeteksi otomatis sebagai **Vite**
   (Build Command: `npm run build`, Output Directory: `dist`).
4. Deploy. Tidak perlu environment variable apa pun.

`vercel.json` sudah disertakan untuk rewrites SPA dan header cache aset.

## Kustomisasi

Hampir semua konten ada di **`src/data.js`**:

| Export     | Isi                                              |
| ---------- | ------------------------------------------------ |
| `profile`  | nama, inisial, peran, lokasi, tagline, email, statistik |
| `skills`   | daftar keahlian + level (0–100)                  |
| `projects` | kartu karya; `hue` (0–360) mengatur warna glow   |
| `journey`  | timeline perjalanan                              |
| `socials`  | tautan sosial                                    |
| `nav`      | item navigasi (id harus sama dengan `id` section) |

Warna dan tipografi diatur lewat CSS variable di bagian atas `src/index.css`:
`--bg`, `--ink`, `--amber`, `--amber-deep`, `--blue`, `--pad`.

## Struktur

```
src/
├─ App.jsx            # layout + semua section
├─ data.js            # konten (edit di sini)
├─ hooks.js           # reveal, parallax, scroll, active section
├─ index.css          # seluruh styling
├─ scroll.js          # state scroll/pointer untuk loop 3D
├─ main.jsx
└─ scene/
   └─ Scene.jsx       # black hole, accretion disk, starfield, kamera
```

## Catatan performa

- Renderer WebGL berhenti total saat `prefers-reduced-motion: reduce`
  (`frameloop="demand"` + scene statis).
- Scroll progress dan parallax disimpan di objek biasa (`scroll.js`) dan dibaca di dalam
  `useFrame`, sehingga tidak memicu re-render React.
- DPR dibatasi `[1, 1.75]` agar aman di HP mid-range.
- Progress bar atas digerakkan lewat `requestAnimationFrame` + `style.transform`.
