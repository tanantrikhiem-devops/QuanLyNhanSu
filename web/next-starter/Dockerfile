# syntax=docker/dockerfile:1.7
# Image production cho Next.js 16 (output: "standalone").
# Kết quả ~180MB thay vì ~1.2GB nếu copy cả node_modules.

ARG NODE_VERSION=22-alpine

# ---------- base: bật corepack để dùng đúng pnpm ghi trong package.json ----------
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH" NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---------- deps: chỉ cài node_modules, cache theo lockfile ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- builder ----------
FROM base AS builder

# Biến NEXT_PUBLIC_* được nhúng vào bundle lúc BUILD, không phải lúc chạy.
# Muốn đổi giá trị thì phải build lại image (hoặc đọc qua Server Component).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- runner: chỉ chứa server đã đóng gói ----------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standalone đã gói sẵn server.js + đúng những package thực sự cần.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Bỏ comment khi dự án có thư mục public/
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
