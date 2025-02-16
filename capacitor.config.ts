import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bookish.test.app',
  appName: 'bookish-test',
  webDir: 'src/app',
  server: {
    androidScheme: 'http',
    url: 'bookish-git-main-grandemepreurs-projects.vercel.app',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
  },
};

export default config;