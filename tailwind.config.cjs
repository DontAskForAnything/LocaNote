/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./src/_app.tsx"],
  theme: {
    extend: {
      fontFamily: {
        "poppins-medium": ["Poppins_500Medium"],
        "open-sans-regular": ["OpenSans_400Regular"],
        "open-sans-semibold": ["OpenSans_600SemiBold"],
        "open-sans-bold": ["OpenSans_700Bold"],
      },
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#141416",
        },
        card: {
          DEFAULT: "#EBEBEB",
          dark: "#1B1B1B",
        },
        cardLight: {
          DEFAULT: "#EBEBEB",
          dark: "#2A2A2A",
        },
        backgroundLight: {
          DEFAULT: "#EBEBEB",
          dark: "#212121",
        },
        title: {
          DEFAULT: "black",
          dark: "#2E54B7",
        },
        primary: {
          DEFAULT: "#16a34a",
          dark: "#16a34a",
        },
        // For cancel button
        cancel: {
          DEFAULT: "#616161",
          dark: "#5C5C5C",
        },
        // For more option popup
        moreOptions: {
          DEFAULT: "#D2D2D2",
          dark: "#383838",
          separator: "#BEBBBB",
          darkSeparator: "#646464",
        },
        // Information separator in account screens
        account: {
          DEFAULT: "#494949",
          dark: "494949",
        },
      },
    },
  },
};
