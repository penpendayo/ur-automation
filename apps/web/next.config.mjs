import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform({
    persist: {
      path: '../../.wrangler/state/v3/', // NOTE: miniflareのストアデータは全パッケージや全アプリで共有されるので、ルートに設置するようにしてる
    },
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@@ur-automation/database',
  ],
};

export default nextConfig;
