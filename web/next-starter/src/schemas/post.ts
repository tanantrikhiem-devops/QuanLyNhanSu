import { z } from "zod";

export const postSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string(),
});

export const postListSchema = z.array(postSchema);

export const createPostInputSchema = z.object({
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
  body: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
});

export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
