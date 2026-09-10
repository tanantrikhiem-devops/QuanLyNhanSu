# next-starter

Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + shadcn/ui + TanStack Query + Zod + Zustand + Vitest. Quản lý package bằng **pnpm**.

## Chạy

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Scripts

| Lệnh | Việc |
|---|---|
| `pnpm dev` | dev server (Turbopack) |
| `pnpm build` / `pnpm start` | build & chạy production |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint 9 flat config |
| `pnpm format` | Prettier + sắp xếp class Tailwind |
| `pnpm test` / `pnpm test:watch` | Vitest + Testing Library |

## Cấu trúc

```
src/
  app/                  # App Router: layout, page, globals.css
  components/
    ui/                 # shadcn/ui (button, card, input, skeleton)
    providers/          # QueryProvider
    theme-toggle.tsx
  features/posts/       # UI theo feature, không nhét hết vào app/
  hooks/use-posts.ts    # TanStack Query: queryKey factory + useQuery/useMutation
  lib/api.ts            # fetch wrapper, validate response bằng Zod
  lib/utils.ts          # cn()
  schemas/post.ts       # nguồn sự thật về type — z.infer ra TS type
  store/use-ui-store.ts # Zustand + persist
  test/                 # setup + renderWithProviders
```

## Vài quy ước

- **Zod là nguồn type duy nhất.** Khai báo schema rồi `z.infer`, đừng viết `interface` song song rồi lệch nhau.
- **`apiFetch` validate mọi response.** Backend đổi field là lỗi nổ ngay tầng data, không lọt xuống component.
- **TanStack Query giữ server state**, Zustand chỉ giữ client state (theme, sidebar). Không nhét dữ liệu API vào Zustand.
- **`queryKey` khai báo tập trung** trong `postKeys` để invalidate không bị gõ sai chuỗi.
- `tsconfig` bật `noUncheckedIndexedAccess` — truy cập mảng trả `T | undefined`, buộc phải xử lý.

## Thêm component shadcn

```bash
pnpm dlx shadcn@latest add dialog dropdown-menu form
```

`components.json` đã cấu hình sẵn (style `new-york`, base color `neutral`, alias `@/*`).

## Biến môi trường

Copy `.env.example` → `.env.local`. Mặc định `NEXT_PUBLIC_API_URL` trỏ tới JSONPlaceholder để trang demo có dữ liệu — đổi sang API thật của bạn.
