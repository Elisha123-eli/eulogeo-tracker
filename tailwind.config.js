/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050A18",
        panel: "#0B1226",
        edge: "#1B2438",
        gold: "#F7941D",
        goldbright: "#FFA733",
        electric: "#2D9CFF",
        electricdeep: "#1565C0",
        mist: "#8A94A8",
        profit: "#2FBF71",
        loss: "#E0524D"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
};
