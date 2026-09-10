import { describe, expect, it } from "vitest";

import { createPostInputSchema, postSchema } from "@/schemas/post";

describe("post schemas", () => {
  it("chấp nhận post hợp lệ", () => {
    const result = postSchema.safeParse({ id: 1, userId: 1, title: "hello", body: "world" });
    expect(result.success).toBe(true);
  });

  it("từ chối post thiếu field", () => {
    const result = postSchema.safeParse({ id: 1, title: "hello" });
    expect(result.success).toBe(false);
  });

  it("báo lỗi khi tiêu đề quá ngắn", () => {
    const result = createPostInputSchema.safeParse({ title: "ab", body: "đủ dài mười ký tự" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title?.[0]).toContain("3 ký tự");
    }
  });
});
