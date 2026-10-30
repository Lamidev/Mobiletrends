/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "DM Sans", "sans-serif"],
        body: ["var(--font-body)", "DM Sans", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
        mono: ["var(--font-manrope)", "Manrope", "sans-serif"],
        caveat: ["var(--font-caveat)", "Caveat", "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0C1172",
          foreground: "#ffffff",
          50: "#edf2ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#0C1172",
          600: "#090e5c",
          700: "#070a46",
          800: "#050730",
          900: "#03041a",
        },
        secondary: {
          DEFAULT: "#DF5E00",
          foreground: "#ffffff",
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#DF5E00",
          600: "#c24e00",
          700: "#9e3f00",
          800: "#7a3000",
          900: "#572200",
        },
        // Mapped peach to Mobiletrends Auth Deep Navy (#111344 / hover #0C1172) for consistent button & UI styling across user & admin
        peach: {
          50: "#eef0f8",
          100: "#dce0f2",
          200: "#b9c1e4",
          300: "#8c99d1",
          400: "#586ab8",
          500: "#111344",
          600: "#0C1172",
          700: "#090d59",
          800: "#06093d",
          900: "#040526",
          950: "#020314",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#DF5E00",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          blue: {
            DEFAULT: "#0C1172",
            hover: "#080c52",
            light: "#edf2ff",
            dark: "#050730",
          },
          orange: {
            DEFAULT: "#DF5E00",
            hover: "#b84d00",
            light: "#fff7ed",
            dark: "#572200",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        brandsMarquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "brands-marquee": "brandsMarquee 38s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
