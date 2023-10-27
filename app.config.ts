import { ExpoConfig } from "@expo/config";

// _ctx: ConfigContext
const defineConfig = (): ExpoConfig => ({
  name: "locanote",
  slug: "locanote",
  version: "0.8.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/icon.png",
    backgroundColor: "#141416",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    config: {
      usesNonExemptEncryption: false,
    },
    supportsTablet: true,
    bundleIdentifier: "misiu.dontaskforanything.locanote",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#141416",
    },
    package: "misiu.dontaskforanything.locanote",
  },
  extra: {
    CLERK_PUBLISHABLE_KEY:
      "pk_test_dWx0aW1hdGUtcmF5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ",
    // eas: {
    //   projectId: "c0c5802d-8183-4aab-88af-27ef68b73009",
    // },
  },
});

export default defineConfig;
