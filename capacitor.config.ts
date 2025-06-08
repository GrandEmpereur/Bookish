import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.app',
  appName: 'bookish',
  webDir: 'src/app',
  server: {
    url: 'http://192.168.1.68:3000',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    CapacitorCookies: {
      enabled: true,
    },
  }
};

export default config;