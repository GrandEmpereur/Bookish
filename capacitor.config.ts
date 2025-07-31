import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.patrick.bookish",
  appName: "Bookish",
  webDir: "src/app",
  server: {
    url: "http://10.2.182.69:3000",
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true,
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  },
  ios: {
    scheme: "Bookish",
    path: "ios",
  },
};

export default config;

