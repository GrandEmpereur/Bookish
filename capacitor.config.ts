import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.dev.app',
  appName: 'bookish',
  webDir: 'src/app',
  server: {
    androidScheme: 'http',
    url: 'http://192.168.1.86:3000',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
  },
};

export default config;