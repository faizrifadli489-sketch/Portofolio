// Semua isi portofolio ada di sini — cukup edit file ini.
export const profile = {
  name: 'Raka Pratama',
  initials: 'RP',
  role: 'Creative Developer & 3D Designer',
  location: 'Bandung, Indonesia',
  tagline:
    'Saya membangun antarmuka yang terasa seperti menjelajah ruang — tenang, presisi, dan sedikit membuat takjub.',
  intro:
    'Enam tahun terakhir saya menghabiskan waktu di antara shader, tipografi, dan sistem desain. Fokus saya sederhana: membuat produk digital yang tidak hanya cepat, tapi juga punya gravitasi.',
  email: 'halo@rakapratama.dev',
  stats: [
    { value: '6+', label: 'Tahun berkarya' },
    { value: '38', label: 'Proyek dirilis' },
    { value: '12', label: 'Penghargaan' },
  ],
}

export const skills = [
  { name: 'React / Next.js', level: 95, note: 'arsitektur & performa' },
  { name: 'Three.js / WebGL', level: 88, note: 'shader, scene graph' },
  { name: 'Motion & GSAP', level: 82, note: 'micro-interaction' },
  { name: 'Design System', level: 90, note: 'token, aksesibilitas' },
  { name: 'TypeScript', level: 86, note: 'tipe yang jujur' },
  { name: 'Blender', level: 74, note: 'modeling & lookdev' },
]

export const projects = [
  {
    id: '01',
    title: 'Event Horizon',
    category: 'WebGL Experience',
    year: '2025',
    desc: 'Situs peluncuran produk dengan simulasi black hole real-time. 4 shader kustom, 60fps di mid-range Android.',
    tags: ['Three.js', 'GLSL', 'Vite'],
    hue: 28,
  },
  {
    id: '02',
    title: 'Orbital',
    category: 'Dashboard Product',
    year: '2024',
    desc: 'Platform analitik untuk tim operasi satelit. 40+ komponen, mode gelap penuh, dan data density tinggi.',
    tags: ['React', 'TypeScript', 'D3'],
    hue: 200,
  },
  {
    id: '03',
    title: 'Tesseract',
    category: 'Design System',
    year: '2024',
    desc: 'Sistem desain lintas 5 produk dengan token otomatis dari Figma ke kode. Waktu rilis turun 34%.',
    tags: ['Tokens', 'Storybook', 'A11y'],
    hue: 265,
  },
  {
    id: '04',
    title: 'Slow Light',
    category: 'Editorial Site',
    year: '2023',
    desc: 'Majalah fotografi dengan transisi halaman sinematik dan pramuat gambar adaptif di jaringan lambat.',
    tags: ['GSAP', 'Sanity', 'Next.js'],
    hue: 12,
  },
]

export const journey = [
  {
    year: '2025',
    title: 'Lead Creative Engineer',
    org: 'Studio Noktah',
    desc: 'Memimpin 4 orang tim untuk pengalaman 3D interaktif kelas brand global.',
  },
  {
    year: '2023',
    title: 'Senior Frontend Engineer',
    org: 'Andromeda Labs',
    desc: 'Membangun ulang produk inti: waktu muat 3,1s → 0,9s, alur onboarding naik 22%.',
  },
  {
    year: '2021',
    title: 'Frontend Developer',
    org: 'Kolektif Ruang',
    desc: 'Situs dan campaign untuk 20+ klien, dari agensi sampai label musik independen.',
  },
  {
    year: '2019',
    title: 'Mulai belajar sendiri',
    org: 'Kamar tidur, 1 laptop',
    desc: 'Dari tutorial HTML sampai commit pertama. Sisanya, obsesi.',
  },
]

export const socials = [
  { label: 'GitHub', handle: '@rakapratama', href: 'https://github.com' },
  { label: 'Dribbble', handle: '@raka', href: 'https://dribbble.com' },
  { label: 'LinkedIn', handle: '/in/rakapratama', href: 'https://linkedin.com' },
  { label: 'X', handle: '@raka_dev', href: 'https://x.com' },
]

export const nav = [
  { id: 'about', label: 'Tentang' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'work', label: 'Karya' },
  { id: 'journey', label: 'Perjalanan' },
  { id: 'contact', label: 'Kontak' },
]
