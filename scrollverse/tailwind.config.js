/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f0f7fa",
        muted: "#9fb3c0",
        deep: "#061019",
        panel: "#0f2133",
        aqua: "#23d7ba",
        amber: "#ffba52",
        coral: "#ff7d65",
        sky: "#7ec6ff"
      },
      boxShadow: {
        soft: "0 18px 56px rgba(0, 0, 0, 0.28)"
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      }
    }
  },
  plugins: []
};
