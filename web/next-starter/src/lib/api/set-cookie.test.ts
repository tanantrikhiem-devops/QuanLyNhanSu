import { describe, expect, it } from "vitest";

import { splitSetCookies } from "@/lib/api/set-cookie";

describe("splitSetCookies", () => {
  it("bóc access_token ra khỏi danh sách cookie chuyển tiếp", () => {
    const result = splitSetCookies([
      "access_token=jwt-a; HttpOnly; Path=/; SameSite=lax; Max-Age=3600",
      "refresh_token=jwt-r; HttpOnly; Path=/; SameSite=lax; Max-Age=2592000",
    ]);

    expect(result.accessToken).toBe("jwt-a");
    expect(result.forward).toHaveLength(1);
    expect(result.forward[0]).toContain("refresh_token=jwt-r");
    expect(result.forward[0]).toContain("HttpOnly");
  });

  it("gỡ Domain của backend và ép Path=/", () => {
    const result = splitSetCookies(["refresh_token=r; Domain=api.local; Path=/api; HttpOnly"]);

    expect(result.forward[0]).not.toMatch(/domain=/i);
    expect(result.forward[0]).toBe("refresh_token=r; Path=/; HttpOnly");
  });

  it("logout: access_token rỗng, cookie refresh vẫn được chuyển tiếp để browser xoá", () => {
    const result = splitSetCookies([
      'access_token=""; Path=/; Max-Age=0',
      'refresh_token=""; Path=/; Max-Age=0',
    ]);

    expect(result.accessToken).toBe("");
    expect(result.forward[0]).toContain("Max-Age=0");
  });

  it("response không đụng cookie thì accessToken là null", () => {
    expect(splitSetCookies([]).accessToken).toBeNull();
  });
});
