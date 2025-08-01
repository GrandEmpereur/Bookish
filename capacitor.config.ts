import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.patrick.bookish",
  appName: "Bookish",
  webDir: "src/app",
  server: {
    url: process.env.NODE_ENV === "development" ? process.env.DEV_API_URL : process.env.NEXT_PUBLIC_API_URL,
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  ios: {
    scheme: "Bookish",
    path: "ios",
  },
};

export default config;
