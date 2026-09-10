import { describe, expect, it } from "vitest";

import { errorResponseSchema } from "@/schemas/api";
import { loginInputSchema, sessionResponseSchema, userSchema } from "@/schemas/auth";

describe("userSchema", () => {
  it("chấp nhận payload UserRead của backend", () => {
    expect(userSchema.parse({ id: 1, email: "a@b.com" })).toEqual({
      id: 1,
      email: "a@b.com",
    });
  });

  it("từ chối id không phải số nguyên dương", () => {
    expect(userSchema.safeParse({ id: 0, email: "a@b.com" }).success).toBe(false);
  });
});

describe("loginInputSchema", () => {
  it("bắt mật khẩu ngắn hơn 8 ký tự — đúng ràng buộc UserLogin", () => {
    const result = loginInputSchema.safeParse({ email: "a@b.com", password: "1234567" });
    expect(result.success).toBe(false);
  });

  it("bắt email sai định dạng", () => {
    expect(loginInputSchema.safeParse({ email: "abc", password: "12345678" }).success).toBe(
      false,
    );
  });
});

describe("sessionResponseSchema", () => {
  it("đọc được response login đã đi qua BFF proxy", () => {
    const parsed = sessionResponseSchema.parse({
      data: { id: 3, email: "a@b.com" },
      meta: null,
      message: "Đăng nhập thành công",
      accessToken: "jwt",
    });
    expect(parsed.accessToken).toBe("jwt");
  });

  it("vẫn hợp lệ khi proxy không bóc được token", () => {
    const parsed = sessionResponseSchema.parse({ data: { id: 3, email: "a@b.com" } });
    expect(parsed.accessToken).toBeUndefined();
  });
});

describe("errorResponseSchema", () => {
  it("đọc được lỗi 422 kèm errors theo từng field", () => {
    const parsed = errorResponseSchema.parse({
      status_code: 422,
      message: "Dữ liệu không hợp lệ",
      errors: { email: ["value is not a valid email address"] },
    });
    expect(parsed.errors?.email).toHaveLength(1);
  });

  it("đọc được lỗi 401 không có errors", () => {
    const parsed = errorResponseSchema.parse({
      status_code: 401,
      message: "Email hoặc mật khẩu không hợp lệ",
    });
    expect(parsed.errors).toBeUndefined();
  });
});
