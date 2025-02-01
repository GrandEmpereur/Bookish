import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.test.app',
  appName: 'bookish-test',
  webDir: 'src/app',
  server: {
    androidScheme: 'http',
    url: 'http://192.168.1.138:3000',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
  },
};

export default config;
