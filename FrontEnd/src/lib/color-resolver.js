/**
 * Smart Color Resolution Engine
 * Automatically maps standard, tech, and cosmetic color names to exact hex values.
 * Admin can type "burgundy", "desert titanium", "midnight", etc., without needing hex codes.
 */

const KNOWN_COLORS = {
  // Rich / Custom Gadget & Fashion Colors
  burgundy: "#800020",
  maroon: "#800000",
  wine: "#722F37",
  bordeaux: "#5C0120",
  crimson: "#DC143C",
  ruby: "#9B111E",

  // Apple & Samsung Signature Titanium / Metal Finishes
  "desert titanium": "#C5B299",
  "natural titanium": "#9D988D",
  "black titanium": "#242526",
  "white titanium": "#E5E4E2",
  "space black": "#1D1D1F",
  "space gray": "#4B4846",
  "space grey": "#4B4846",
  midnight: "#191F28",
  starlight: "#F0EAD6",
  graphite: "#3C3D3A",
  "sierra blue": "#698DA4",
  "alpine green": "#3B4E43",
  "deep purple": "#3A2E39",
  "pacific blue": "#2E4756",
  "rose gold": "#B76E79",
  gold: "#D4AF37",
  silver: "#D8D9DA",
  platinum: "#E5E4E2",
  bronze: "#CD7F32",
  copper: "#B87333",

  // Samsung Signature Colors
  "titanium gray": "#5E5F64",
  "titanium black": "#28292B",
  "titanium yellow": "#E6D8A2",
  "titanium violet": "#524F60",
  "amber yellow": "#F5C342",
  "cobalt violet": "#44355B",
  "marble gray": "#B7B7B9",
  "onyx black": "#101010",
  "phantom black": "#181818",
  "phantom silver": "#E0E0E0",
  "phantom green": "#2F3D35",

  // Standard Colors
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  grey: "#808080",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#FBBF24",
  orange: "#F97316",
  purple: "#8B5CF6",
  pink: "#EC4899",
  teal: "#14B8A6",
  cyan: "#06B6D4",
  indigo: "#6366F1",
  emerald: "#059669",
  lime: "#84CC16",
  amber: "#F59E0B",
  coral: "#FF7F50",
  salmon: "#FA8072",
  navy: "#000080",
  lavender: "#E6E6FA",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  ivory: "#FFFFF0",
  charcoal: "#36454F",
  olive: "#808000",
  mint: "#98FF98",
  turquoise: "#40E0D0",
  violet: "#7F00FF",
  brown: "#78350F",
};

/**
 * Resolves a text color name into a validated hex code and formatted display name.
 * @param {string} rawName - e.g. "burgundy", "desert titanium", "Space Black"
 * @returns {{ name: string, hex: string }}
 */
export function resolveColorName(rawName) {
  if (!rawName || typeof rawName !== "string") {
    return { name: "Default", hex: "#111344" };
  }

  const cleanName = rawName.trim();
  const lower = cleanName.toLowerCase();

  // 1. Direct dictionary match
  if (KNOWN_COLORS[lower]) {
    return { name: cleanName, hex: KNOWN_COLORS[lower] };
  }

  // 2. Check if user typed a valid hex directly
  if (/^#([0-9A-F]{3}){1,2}$/i.test(cleanName)) {
    return { name: cleanName.toUpperCase(), hex: cleanName };
  }

  // 3. Fallback: Generate a deterministic clean pastel/brand tone based on string hash
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  const generatedHex = `#${"00000".substring(0, 6 - c.length)}${c}`;

  return { name: cleanName, hex: generatedHex };
}
