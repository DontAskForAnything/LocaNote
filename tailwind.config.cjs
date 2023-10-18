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
        input: {
          DEFAULT: "#EBEBEB",
          dark: "#1B1B1B",
        },
        title: {
          DEFAULT: "black",
          dark: "#2E54B7",
        },
        primary: {
          DEFAULT: "#172750",
          dark: "#2E54B7",
        },
        // For all switches such as private/public yes/no
        switch: {
          DEFAULT: "#FFFFFF",
          dark: "#757575",
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
