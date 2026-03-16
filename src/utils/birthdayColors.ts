// Maps a birthday month to a nebula color palette.
// Each season has a distinct feel that tints the galaxy.

interface NebulaPalette {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
  muted: string;
  wisp: string;
}

const PALETTES: Record<string, NebulaPalette> = {
  // Winter (Dec, Jan, Feb) — icy blues, silver
  winter: {
    primary: '#2a4a8f',
    secondary: '#7baaf7',
    glow: '#a0c4ff',
    accent: '#c8deff',
    muted: '#1a2d5a',
    wisp: '#60a0d0',
  },
  // Spring (Mar, Apr, May) — soft pinks, lavender, green
  spring: {
    primary: '#8b5fbf',
    secondary: '#e8a0c8',
    glow: '#f0c0e0',
    accent: '#a8d8a0',
    muted: '#5a3080',
    wisp: '#c080d0',
  },
  // Summer (Jun, Jul, Aug) — warm golds, coral, amber
  summer: {
    primary: '#c07030',
    secondary: '#ffd080',
    glow: '#ffb060',
    accent: '#ff8860',
    muted: '#6b3a20',
    wisp: '#e0a040',
  },
  // Autumn (Sep, Oct, Nov) — deep reds, burnt orange, bronze
  autumn: {
    primary: '#8b3040',
    secondary: '#d07050',
    glow: '#e09060',
    accent: '#c08040',
    muted: '#4a2030',
    wisp: '#b06848',
  },
};

function getSeason(month: number): string {
  if (month === 11 || month <= 1) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
}

export function getNebulaColors(birthday: Date): NebulaPalette {
  const season = getSeason(birthday.getMonth());
  return PALETTES[season];
}

export function getNebulaBlobColors(birthday: Date): string[] {
  const p = getNebulaColors(birthday);
  return [p.primary, p.secondary, p.wisp, p.muted, p.glow, p.accent];
}
