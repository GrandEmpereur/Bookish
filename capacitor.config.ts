import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.test.app',
  appName: 'bookish-test',
  webDir: 'out',
  "server": {
    "url": "http://192.168.1.138:3000",
    "cleartext": true
  },
};

export default config;
