import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [{
      source: "/api/v1/:path*",
      destination: `${process.env.API_INTERNAL_URL ?? "http://api"}/api/v1/:path*`,
    }];
  },

  /** Đóng gói server tối giản vào .next/standalone — image Docker nhỏ, không cần node_modules. */
  output: "standalone",

  /** <Link href> chỉ nhận route có thật (ổn định từ Next 16). */
  typedRoutes: true,

  /**
   * Cache Components: mọi thứ dynamic mặc định chạy lúc request;
   * muốn cache thì khai báo `"use cache"`. Shell tĩnh vẫn được prerender,
   * phần động stream qua <Suspense> (Partial Prerendering).
   */
  cacheComponents: true,

  /** Tự memo hoá component — bỏ được phần lớn useMemo/useCallback thủ công. */
  reactCompiler: true,

  experimental: {
    /** Giữ cache của Turbopack trên đĩa giữa các lần chạy `next dev`. */
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
