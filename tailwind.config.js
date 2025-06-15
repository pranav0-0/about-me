/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    // other file paths
  ],
  theme: {
    extend: {
      colors: {
        // Define custom palette
        primary: "#111111", // black-ish
        accent: "#E10600",  // vibrant red
        lightBg: "#F7F7F7", // light gray/off-white
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        slideUp: "slideUp 1s ease-out forwards",
        zoomIn: "zoomIn 0.8s ease-out forwards",       // new animation
        // rotateIn: "rotateIn 0.8s ease-out forwards",   // new animation
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        zoomIn: {
          "0%": { opacity: 0, transform: "scale(0.5)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        rotateIn: {
          "0%": { opacity: 0, transform: "rotate(-180deg)" },
          "100%": { opacity: 1, transform: "rotate(0)" },
        },
      },
      // fontFamily: {
      //   display: ["Orbitron", "sans-serif"],
      //   body: ["Helvetica", "Arial", "sans-serif"],
      // },
    },
  },
  plugins: [],
};
