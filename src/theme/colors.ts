// Galaxy-inspired color palette for MemorySky
// Reference: Orion Nebula — deep space blacks, navy blues, purple nebulae, teal/cyan wisps

export const colors = {
  // Backgrounds — Deep Space (dark with blue undertone, not just purple)
  bgPrimary: '#050510',     // near-black with blue undertone
  bgCard: '#0d1230',        // dark navy card surface
  bgModal: '#161b3a',       // mid-tone navy modal
  bgInput: '#1e2548',       // lighter navy input

  // Borders & subtle surfaces
  border: '#1e2550',        // dark blue-violet border
  borderLight: '#3a2d6b',   // brighter purple-blue border

  // Text
  textPrimary: '#f4f4f5',   // star-white
  textSecondary: '#a8b4d4', // cool silver-blue
  textMuted: '#6b7aaa',     // muted blue
  textSubtle: '#7e88aa',    // placeholder blue-gray

  // Accent — Nebula (purple/magenta pops against blue base)
  accent: '#c060d0',        // bright magenta-pink
  accentGlow: '#cb00ff',    // bright purple glow
  accentSoft: '#6b3fa030',  // translucent purple

  // Teal / Cyan — Nebula wisps
  teal: '#4ac8b0',          // teal wisp
  cyan: '#60d0d0',          // cyan highlight

  // Highlights / Stars
  starWhite: '#ffffff',
  starSoft: '#d4daf0',      // cool blue-white star glow

  // FAB / Primary action
  fabBg: '#7b4bbf',         // purple that pops on dark navy
  fabShadow: '#c060d0',     // magenta glow

  // Cancel / Destructive
  cancel: '#a8b4d4',
};

// Emotion star colors — galaxy-themed
export const emotionColors: Record<string, string> = {
  happy: '#FFD93D',         // warm yellow
  sad: '#4A90E2',           // soft blue
  nostalgic: '#C8A2C8',     // dusty lavender
  grateful: '#6BCB77',      // gentle green
  excited: '#FF8C42',       // energetic orange
  peaceful: '#A8E6CF',      // calm mint
  bittersweet: '#B08BBB',   // muted purple
  angry: '#E63946',         // fiery red
};
