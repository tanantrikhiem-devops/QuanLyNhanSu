export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  forgot: "/forgot",
  reset: "/reset",
} as const;

export const REDIRECT_PARAM = "tiep-tuc";

export function safeRedirect(target: unknown, fallback = "/"): string {
  return typeof target === "string" && target.startsWith("/") && !target.startsWith("//")
    ? target
    : fallback;
}
