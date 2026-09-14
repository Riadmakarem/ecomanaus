/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Verde-floresta amazônico — cor principal da marca
        eco: {
          50: "#eefdf6",
          100: "#d5f7e6",
          200: "#adedd0",
          300: "#79dfb4",
          400: "#45cb93",
          500: "#22b077",
          600: "#158f60",
          700: "#12714c",
          800: "#135a3f",
          900: "#114a35",
          950: "#062c1f",
        },
        // Barro do Rio Negro/Solimões — accent quente que assina a marca
        clay: {
          50: "#fdf6f1",
          100: "#fbe9dc",
          200: "#f6cfb2",
          300: "#efad80",
          400: "#e6884f",
          500: "#d9692e",
          600: "#bb501f",
          700: "#963e1a",
          800: "#78331b",
          900: "#622b18",
        },
        ink: {
          900: "#0d1a15",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "Sora",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgb(6 44 31 / 0.08), 0 8px 24px -8px rgb(6 44 31 / 0.10)",
        glow: "0 0 0 1px rgb(34 176 119 / 0.15), 0 12px 32px -8px rgb(34 176 119 / 0.35)",
      },
      backgroundImage: {
        "eco-mesh":
          "radial-gradient(circle at 15% 15%, rgba(69, 203, 147, 0.35), transparent 40%), radial-gradient(circle at 85% 25%, rgba(217, 105, 46, 0.25), transparent 45%), radial-gradient(circle at 50% 90%, rgba(34, 176, 119, 0.25), transparent 50%)",
      },
      borderRadius: {
        "4xl": "1.75rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.15)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        blob: "blob 14s infinite ease-in-out",
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};