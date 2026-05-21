/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./popup.tsx", "./src/**/*.{ts,tsx}"],
  important: ".tipchain-ui",
  corePlugins: {
    preflight: false
  },
  plugins: []
}
