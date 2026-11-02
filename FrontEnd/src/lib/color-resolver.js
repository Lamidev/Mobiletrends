/**
 * Smart Color Resolution Engine
 * Automatically maps standard, tech, and cosmetic color names to exact hex values.
 * Includes typo tolerance (Levenshtein distance) and common alias resolution.
 */

export const KNOWN_COLORS = {
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
  "titanium grey": "#5E5F64",
  "titanium black": "#28292B",
  "titanium yellow": "#E6D8A2",
  "titanium violet": "#524F60",
  "amber yellow": "#F5C342",
  "cobalt violet": "#44355B",
  "marble gray": "#B7B7B9",
  "marble grey": "#B7B7B9",
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

// Common typos and phonetic aliases
const COLOR_ALIASES = {
  burgundry: "burgundy",
  burgandy: "burgundy",
  burgendy: "burgundy",
  titamium: "natural titanium",
  titanum: "natural titanium",
  "desert titamium": "desert titanium",
  "natural titamium": "natural titanium",
  spacegray: "space gray",
  spacegrey: "space grey",
  spaceblack: "space black",
  rosegold: "rose gold",
  sierrablue: "sierra blue",
  deeppurple: "deep purple",
  pacificblue: "pacific blue",
  midnightblue: "midnight",
};

// Calculate Levenshtein distance between two strings
function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Resolves a text color name into a validated hex code and formatted display name.
 * @param {string} rawName - e.g. "burgundy", "burgundry", "desert titanium", "#800020"
 * @param {string} [customHex] - Optional manual override hex from color picker
 * @returns {{ name: string, hex: string, isRecognized: boolean, matchedKey: string }}
 */
export function resolveColorName(rawName, customHex = "") {
  if (!rawName || typeof rawName !== "string") {
    return { name: "Default", hex: customHex || "#111344", isRecognized: true, matchedKey: "default" };
  }

  const cleanName = rawName.trim();
  const lower = cleanName.toLowerCase();

  // 1. Direct dictionary match
  if (KNOWN_COLORS[lower]) {
    return { name: cleanName, hex: KNOWN_COLORS[lower], isRecognized: true, matchedKey: lower };
  }

  // 2. Direct alias match (e.g. "burgundry" -> "burgundy")
  if (COLOR_ALIASES[lower] && KNOWN_COLORS[COLOR_ALIASES[lower]]) {
    const canonicalKey = COLOR_ALIASES[lower];
    // Keep user's capitalized label or canonical name
    return {
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      hex: KNOWN_COLORS[canonicalKey],
      isRecognized: true,
      matchedKey: canonicalKey
    };
  }

  // 3. User supplied direct valid hex
  if (/^#([0-9A-F]{3}){1,2}$/i.test(cleanName)) {
    return { name: cleanName.toUpperCase(), hex: cleanName, isRecognized: true, matchedKey: "hex" };
  }

  // 4. Fuzzy Levenshtein match across known colors (threshold: distance <= 2 for words >= 5 chars)
  let bestMatch = null;
  let minDistance = 999;
  for (const colorKey of Object.keys(KNOWN_COLORS)) {
    // Only fuzzy match single words or matching token counts
    const dist = levenshtein(lower, colorKey);
    if (dist < minDistance && dist <= (lower.length > 5 ? 2 : 1)) {
      minDistance = dist;
      bestMatch = colorKey;
    }
  }

  if (bestMatch) {
    return {
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      hex: KNOWN_COLORS[bestMatch],
      isRecognized: true,
      matchedKey: bestMatch
    };
  }

  // 5. Custom hex passed in from color picker or fallback
  if (customHex && /^#([0-9A-F]{3}){1,2}$/i.test(customHex)) {
    return { name: cleanName, hex: customHex, isRecognized: true, matchedKey: "custom" };
  }

  // 6. Unknown color: use subtle neutral slate fallback so it never shows an unexpected green/random tone
  return { name: cleanName, hex: "#64748B", isRecognized: false, matchedKey: "unknown" };
}
