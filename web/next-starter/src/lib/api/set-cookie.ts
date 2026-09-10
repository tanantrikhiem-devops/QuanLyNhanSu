import { ACCESS_COOKIE } from "@/lib/api/config";

/** Kết quả bóc tách header `Set-Cookie` mà FastAPI trả về. */
export type SplitCookies = {
  /**
   * Giá trị `access_token`: chuỗi JWT khi đăng nhập/refresh, chuỗi rỗng khi
   * backend xoá cookie (logout), `null` khi response không đụng tới cookie này.
   */
  accessToken: string | null;
  /** Các cookie còn lại (thực tế là `refresh_token`) để chuyển tiếp cho browser. */
  forward: string[];
};

function nameOf(cookie: string): string {
  const eq = cookie.indexOf("=");
  return eq === -1 ? cookie.trim() : cookie.slice(0, eq).trim();
}

function valueOf(cookie: string): string {
  const eq = cookie.indexOf("=");
  if (eq === -1) return "";
  const end = cookie.indexOf(";", eq);
  const raw = (end === -1 ? cookie.slice(eq + 1) : cookie.slice(eq + 1, end)).trim();
  // `delete_cookie` của Starlette ghi giá trị rỗng dạng `""` — bỏ cặp nháy đi
  // để phía trên chỉ cần kiểm tra chuỗi rỗng.
  return raw.replace(/^"(.*)"$/, "$1");
}

/**
 * Bỏ thuộc tính `Domain` (cookie phải gắn với origin của Next, không phải của
 * FastAPI) và ép `Path=/` để cookie có mặt ở mọi route.
 */
function normalize(cookie: string): string {
  const parts = cookie
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !/^domain=/i.test(part) && !/^path=/i.test(part));

  const [pair, ...attributes] = parts;
  return [pair, "Path=/", ...attributes].join("; ");
}

/**
 * Tách `access_token` ra khỏi luồng cookie: token này sẽ được trả xuống body
 * để client giữ trong RAM, còn `refresh_token` vẫn ở lại dạng httpOnly cookie.
 */
export function splitSetCookies(setCookies: readonly string[]): SplitCookies {
  let accessToken: string | null = null;
  const forward: string[] = [];

  for (const cookie of setCookies) {
    if (nameOf(cookie) === ACCESS_COOKIE) {
      accessToken = valueOf(cookie);
    } else {
      forward.push(normalize(cookie));
    }
  }

  return { accessToken, forward };
}
