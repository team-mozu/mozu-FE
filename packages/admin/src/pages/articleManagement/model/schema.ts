import { z } from "zod";

export const articleSchema = z.object({
  articleName: z
    .string()
    .nonempty("기사 제목을 입력해주세요.")
    .min(2, "기사 제목은 2자 이상 입력해주세요.")
    .max(300, "기사 제목은 300자 이하로 입력해주세요."),
  articleDesc: z
    .string()
    .nonempty("기사 내용을 입력해주세요.")
    .min(10, "기사 내용은 10자 이상 입력해주세요.")
    .max(100000, "기사 내용은 10,000자 이하로 입력해주세요."),
  articleImage: z
    .union([
      z.instanceof(File),
      z.string(),
      z.null(),
    ])
    .refine(value => value instanceof File, {
      message: "기사 이미지를 선택해주세요.",
    }),
});
