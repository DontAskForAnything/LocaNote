import { ExpoConfig } from "@expo/config";

// _ctx: ConfigContext
const defineConfig = (): ExpoConfig => ({
  name: "locanote",
  slug: "locanote",
  version: "0.8.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    backgroundColor: "#ea5b6e",
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
      backgroundColor: "#ea5b6e",
    },
    package: "misiu.dontaskforanything.locanote",
  },
  extra: {
    // eas: {
    //   projectId: "c0c5802d-8183-4aab-88af-27ef68b73009",
    // },
  },
});

export default defineConfig;
