/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan src files for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // Enable DaisyUI plugin
  ],
  // Optional: Configure DaisyUI themes if needed
  daisyui: {
    themes: ["dark"], // Example: Use the dark theme by default
  },
} 