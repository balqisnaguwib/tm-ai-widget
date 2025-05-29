/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          // TM colors
          "tm-blue": "#0077B5",
          "tm-dark-blue": "#005A8B",
          "tm-light-blue": "#0091D9",
          "tm-orange": "#FF6B00",
          "tm-light-orange": "#FF9240",
          "tm-dark-orange": "#E55E00",
        },
        animation: {
          "gradient-x": "gradient-x 15s ease infinite",
          "float": "float 6s ease-in-out infinite",
          "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          "bounce-slow": "bounce 3s infinite",
        },
        keyframes: {
          "gradient-x": {
            "0%, 100%": {
              "background-position": "0% 50%",
            },
            "50%": {
              "background-position": "100% 50%",
            },
          },
          "float": {
            "0%, 100%": {
              transform: "translateY(0)",
            },
            "50%": {
              transform: "translateY(-10px)",
            },
          },
        },
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        },
        boxShadow: {
          "neumorph": "20px 20px 60px #d0d0d0, -20px -20px 60px #ffffff",
          "neumorph-dark": "20px 20px 60px #1a1a1a, -20px -20px 60px #262626",
          "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },
        backdropBlur: {
          "xs": "2px",
        },
      },
    },
    plugins: [],
  };