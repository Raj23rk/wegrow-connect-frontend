// Centralized Theme Configuration File (Exact WeGrow Blue & Golden Orange)
export const lightTheme = {
  // Backgrounds & Light Overlay
  bgDark: "#f4f7fb",
  bgOverlay: "linear-gradient(90deg, rgba(244,247,251,0.92) 0%, rgba(235,241,250,0.85) 50%, rgba(244,247,251,0.70) 100%)",
  heroOverlay: "linear-gradient(to bottom, rgba(242,244,248,0.78) 0%, rgba(242,244,248,0.65) 50%, rgba(242,244,248,0.82) 100%)",

  // Brand Colors (Directly picked from WeGrow Logo & Banner)
  primary: "#104288",          // Deep Royal Blue (Headings & Primary Text)
  primaryHover: "#0a2e61",
  
  // Exact WeGrow Golden Orange from image
  orange: "#f3a812",           // Bright WeGrow Orange Accent
  orangeHover: "#d9920a",
  
  accentBtn: "#f3a812",        // Primary Button Fill Color
  accentBtnText: "#ffffff",    // Button Text Color (White)

  // Text Colors
  textMain: "#1e293b",         // Primary Reading Text
  textMuted: "#50637f",        // Subtitles / Secondary Captions
  textBright: "#0f172a",       // Emphasized Headings

  // Cards & Interactive Elements
  cardBg: "rgba(255, 255, 255, 0.90)",
  cardBorder: "rgba(16, 66, 136, 0.15)",
  cardBorderHover: "#f3a812",
  dropdownBg: "rgba(255, 255, 255, 0.98)"
};

export const darkTheme = {
  bgDark: "#061325",
  bgOverlay: "linear-gradient(180deg, rgba(6, 19, 37, 0.96) 0%, rgba(4, 12, 24, 0.98) 100%)",
  heroOverlay: "linear-gradient(to bottom, rgba(6,19,37,0.88) 0%, rgba(6,19,37,0.78) 50%, rgba(6,19,37,0.94) 100%)",

  primary: "#60a5fa",          // Bright Light Blue for Dark Mode
  primaryHover: "#93c5fd",
  
  orange: "#f3a812",           // Bright WeGrow Orange Accent
  orangeHover: "#fbbf24",
  
  accentBtn: "#f3a812",
  accentBtnText: "#ffffff",

  textMain: "#f1f5f9",         // Crisp Light Slate for text
  textMuted: "#cbd5e1",        // Bright readable Slate-300 for captions
  textBright: "#ffffff",       // Pure White for headings

  cardBg: "rgba(15, 23, 42, 0.85)",
  cardBorder: "rgba(148, 163, 184, 0.20)",
  cardBorderHover: "#f3a812",
  dropdownBg: "rgba(15, 23, 42, 0.98)"
};

export const theme = {
  bgDark: "var(--wegrow-bg-dark, #f4f7fb)",
  bgOverlay: "var(--wegrow-bg-overlay, linear-gradient(90deg, rgba(244,247,251,0.92) 0%, rgba(235,241,250,0.85) 50%, rgba(244,247,251,0.70) 100%))",
  heroOverlay: "var(--wegrow-hero-overlay, linear-gradient(to bottom, rgba(242,244,248,0.78) 0%, rgba(242,244,248,0.65) 50%, rgba(242,244,248,0.82) 100%))",

  primary: "var(--wegrow-primary, #104288)",
  primaryHover: "var(--wegrow-primary-hover, #0a2e61)",
  
  orange: "var(--wegrow-orange, #f3a812)",
  orangeHover: "var(--wegrow-orange-hover, #d9920a)",
  
  accentBtn: "var(--wegrow-orange, #f3a812)",
  accentBtnText: "#ffffff",

  textMain: "var(--wegrow-text-main, #1e293b)",
  textMuted: "var(--wegrow-text-muted, #50637f)",
  textBright: "var(--wegrow-text-bright, #0f172a)",

  cardBg: "var(--wegrow-card-bg, rgba(255, 255, 255, 0.90))",
  cardBorder: "var(--wegrow-card-border, rgba(16, 66, 136, 0.15))",
  cardBorderHover: "#f3a812",
  dropdownBg: "var(--wegrow-dropdown-bg, rgba(255, 255, 255, 0.98))"
};

export function getTheme(isDarkMode) {
  return isDarkMode ? darkTheme : lightTheme;
}