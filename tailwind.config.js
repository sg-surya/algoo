/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFBF0",
        brutalYellow: "#FFDE59",
        brutalPink: "#FF90E8",
        brutalCyan: "#7CF8FF",
        brutalLime: "#B8FF66",
        brutalViolet: "#A78BFA",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px #000",
        "brutal-sm": "3px 3px 0px #000",
        "brutal-lg": "6px 6px 0px #000",
        "brutal-xl": "8px 8px 0px #000",
      },
      borderWidth: {
        "2.5": "2.5px",
      }
    },
  },
  plugins: [],
}
