/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2a37",
        muted: "#5f6b7a",
        deep: "#eef3f8",
        panel: "#ffffff",
        aqua: "#2f9e9a",
        amber: "#c8872f",
        coral: "#d56d5f",
        sky: "#6f92c9"
      },
      boxShadow: {
        soft: "0 14px 38px rgba(31, 42, 55, 0.12)"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
