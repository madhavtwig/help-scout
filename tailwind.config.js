const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        primary: ["Inter var", ...defaultTheme.fontFamily.sans],
        heading: ["Inter var", ...defaultTheme.fontFamily.sans],
        display: ["Lexend", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        md: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "2rem" }],
        xl: ["1.25rem", { lineHeight: "2rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["2rem", { lineHeight: "2.5rem" }],
        "4xl": ["2.5rem", { lineHeight: "3.5rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1.1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        orange: colors.orange,
        violet: colors.violet,
        sky: colors.sky,
        shade: {
          100: "var(--shade-100)",
          200: "var(--shade-200)",
          300: "var(--shade-300)",
          400: "var(--shade-400)",
          500: "var(--shade-500)",
          600: "var(--shade-600)",
          700: "var(--shade-700)",
        },
        black: "var(--black)",
      },
      extend: {
        borderRadius: {
          "4xl": "2rem",
        },
        fontFamily: {
          sans: ["Inter", ...defaultTheme.fontFamily.sans],
          display: ["Lexend", ...defaultTheme.fontFamily.sans],
        },
        maxWidth: {
          "2xl": "40rem",
        },
      },
    },
  },
  variants: {
    backgroundColor: ["DEFAULT", "hover", "focus", "group-hover"],
    fontWeight: ["responsive", "hover", "focus"],
    opacity: ["hover"],
    borderColor: ["hover", "focus"],
    margin: ["first", "last"],
    scale: ["hover", "active", "group-hover"],
    extend: {},
    textColor: ["group-hover"],
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};
