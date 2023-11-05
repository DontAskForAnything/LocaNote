import { ExpoConfig } from "@expo/config";

// _ctx: ConfigContext
const defineConfig = (): ExpoConfig => ({
  name: "LocaNote",
  scheme: "locanote",
  slug: "locanote",
  version: "0.9.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splashscreen.png",
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
    CLERK_PUBLISHABLE_KEY: "<YOUR_CLERK_KEY>",
    OPENAI_API_KEY: "<YOUR_OPENAI_KEY>", // Change this value to match your openai key
    eas: {
      projectId: "<YOUR_EXPO_PROJECT_ID>",
    },
  },
});

export default defineConfig;
