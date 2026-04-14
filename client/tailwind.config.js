/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F4FD",
          100: "#D1E9FA",
          200: "#A3D3F5",
          300: "#75BDF0",
          400: "#47A7EB",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        accent: {
          pink: "#FCE7F3",
          yellow: "#FEF3C7",
          mint: "#D1FAE5",
          lavender: "#E0E7FF",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          800: "#1F2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
