/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // General Design Tokens
        design: {
          primaryGrey: "#737373",
          black: "#2c2c2c",
          white: "#FFFFFF",
          greyOutlines: "#F0F0F0",
          greyBG: "#F1F1F1",
          socialHubYellow: "#FFF763",
          primaryPurple: "#6D28D9",
          lightPurpleButtonFill: "#F0EEFF",
          graySecondaryButtonFill: "#F7F8FA",
          lightVioletSelection: "#F5F3FF",
          greenSuccess: "#22C55E",
          redFailure: "#EF4444",
        },
        // Button Tokens
        button: {
          primary: {
            cta: "#6D28D9",
            hover: "#5B21B6",
            pressed: "#D1B5FD",
            text: "#FFFFFF",
            focus: "#F0F0F0",
          },
          outline: {
            fill: "#F0EEFF",
            stroke: "#6D28D9",
            focus: "#F0F0F0",
            disabledText: "#C2C2C2",
            disabledOutline: "#E0E0E0",
          },
          tertiary: {
            fill: "#F0EEFF",
            text: "#6D28D9",
          },
          secondary: {
            fill: "#F7F8FA",
            text: "#2c2c2c",
            outline: "#F0F0F0",
          },
          disabled: {
            fill: "#5B21B6",
            text: "#C2C2C2",
          },
        },
        // Semantic Colors
        semantic: {
          success: {
            light: "#ECFDF5",
            DEFAULT: "#10B981",
            hover: "#059669",
          },
          error: {
            light: "#FEF2F2",
            DEFAULT: "#EF4444",
            hover: "#DC2626",
          },
          warning: {
            light: "#FFFBEB",
            DEFAULT: "#F59E0B",
            hover: "#D97706",
          },
          info: {
            light: "#EFF6FF",
            DEFAULT: "#3B82F6",
            hover: "#2563EB",
          },
        },
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
      },
    },
  },
  plugins: [],
};
