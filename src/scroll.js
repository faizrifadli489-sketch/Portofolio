// State global ringan: dibaca oleh loop animasi 3D tanpa memicu re-render React.
export const scrollState = {
  progress: 0, // 0 → 1 sepanjang halaman
  velocity: 0,
  pointer: { x: 0, y: 0 }, // -1 → 1
}
