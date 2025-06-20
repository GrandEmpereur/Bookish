import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.patrick.bookish",
  appName: "Bookish",
  webDir: "src/app",
  server: {
    url: "https://bookish.bartosik.fr",
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true,
    },
  },
  ios: {
    scheme: "Bookish",
    path: "ios",
  },
};

export default config;

