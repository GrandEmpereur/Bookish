import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.test.app',
  appName: 'bookish-test',
  webDir: 'src/app',
  server: {
    androidScheme: 'http',
    url: 'http://172.20.10.2:3000',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
  },
};

export default config;
