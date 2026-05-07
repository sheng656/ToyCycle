import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@toycycle/shared'],
};

export default withNextIntl(nextConfig);
