import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.test.app',
  appName: 'bookish',
  webDir: 'src/app',
  server: {
    androidScheme: 'http',
    url: process.env.NEXT_PUBLIC_CAPACITOR_URL,
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
  },
};

export default config;
