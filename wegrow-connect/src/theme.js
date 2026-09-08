// Centralized Theme Configuration File (WeGrow B-School Royal Navy, Golden Amber & Coral)
export const lightTheme = {
  // Backgrounds & Warm Paper
  bgDark: "#FAF6ED",
  bgOverlay: "linear-gradient(90deg, rgba(250,246,237,0.95) 0%, rgba(240,233,214,0.88) 50%, rgba(253,251,245,0.75) 100%)",
  heroOverlay: "linear-gradient(to bottom, rgba(250,246,237,0.88) 0%, rgba(250,246,237,0.65) 50%, rgba(250,246,237,0.94) 100%)",

  // Brand Colors
  primary: "#104288",          // Deep Royal Navy Blue (Headings & Primary Text)
  primaryHover: "#0c336b",
  
  orange: "#f3a812",           // Warm Golden Amber Accent
  orangeHover: "#d9920a",
  
  accentBtn: "#FF6A45",        // Vibrant Coral Pill Button Fill
  accentBtnText: "#ffffff",

  // Text Colors
  textMain: "#1e293b",         // Primary Slate Text
  textMuted: "#475569",        // Subtitles / Secondary Captions
  textBright: "#0f172a",       // Emphasized Headings

  // Cards & Interactive Elements
  cardBg: "rgba(255, 254, 250, 0.94)",
  cardBorder: "rgba(16, 66, 136, 0.14)",
  cardBorderHover: "#f3a812",
  dropdownBg: "rgba(255, 254, 250, 0.98)"
};

export const darkTheme = {
  bgDark: "#061325",
  bgOverlay: "linear-gradient(180deg, rgba(6, 19, 37, 0.96) 0%, rgba(4, 12, 24, 0.98) 100%)",
  heroOverlay: "linear-gradient(to bottom, rgba(6,19,37,0.92) 0%, rgba(6,19,37,0.80) 50%, rgba(6,19,37,0.96) 100%)",

  primary: "#60a5fa",          // Bright Light Blue for Dark Mode
  primaryHover: "#93c5fd",
  
  orange: "#f3a812",           // Bright WeGrow Orange Accent
  orangeHover: "#fbbf24",
  
  accentBtn: "#FF6A45",
  accentBtnText: "#ffffff",

  textMain: "#f1f5f9",         // Crisp Light Slate for text
  textMuted: "#cbd5e1",        // Bright readable Slate-300 for captions
  textBright: "#ffffff",       // Pure White for headings

  cardBg: "rgba(15, 23, 42, 0.88)",
  cardBorder: "rgba(148, 163, 184, 0.20)",
  cardBorderHover: "#f3a812",
  dropdownBg: "rgba(15, 23, 42, 0.98)"
};

export const theme = {
  bgDark: "var(--wegrow-bg-dark, #FAF6ED)",
  bgOverlay: "var(--wegrow-bg-overlay, linear-gradient(90deg, rgba(250,246,237,0.95) 0%, rgba(240,233,214,0.88) 50%, rgba(253,251,245,0.75) 100%))",
  heroOverlay: "var(--wegrow-hero-overlay, linear-gradient(to bottom, rgba(250,246,237,0.88) 0%, rgba(250,246,237,0.65) 50%, rgba(250,246,237,0.94) 100%))",

  primary: "var(--wegrow-primary, #104288)",
  primaryHover: "var(--wegrow-primary-hover, #0c336b)",
  
  orange: "var(--wegrow-orange, #f3a812)",
  orangeHover: "var(--wegrow-orange-hover, #d9920a)",
  
  accentBtn: "var(--wegrow-accent-btn, #FF6A45)",
  accentBtnText: "#ffffff",

  textMain: "var(--wegrow-text-main, #1e293b)",
  textMuted: "var(--wegrow-text-muted, #475569)",
  textBright: "var(--wegrow-text-bright, #0f172a)",

  cardBg: "var(--wegrow-card-bg, rgba(255, 254, 250, 0.94))",
  cardBorder: "var(--wegrow-card-border, rgba(16, 66, 136, 0.14))",
  cardBorderHover: "#f3a812",
  dropdownBg: "var(--wegrow-dropdown-bg, rgba(255, 254, 250, 0.98))"
};

export function getTheme(isDarkMode) {
  return isDarkMode ? darkTheme : lightTheme;
}