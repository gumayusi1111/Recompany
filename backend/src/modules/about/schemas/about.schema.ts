import { z } from 'zod';

/**
 * 关于我们基本模式
 */
export const AboutSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
});

/**
 * 创建关于我们请求模式
 */
export const CreateAboutSchema = AboutSchema.omit({ id: true });

/**
 * 更新关于我们请求模式
 */
export const UpdateAboutSchema = CreateAboutSchema.partial();

/**
 * 关于我们类型定义
 */
export type About = z.infer<typeof AboutSchema>;

/**
 * 创建关于我们请求类型
 */
export type CreateAboutInput = z.infer<typeof CreateAboutSchema>;

/**
 * 更新关于我们请求类型
 */
export type UpdateAboutInput = z.infer<typeof UpdateAboutSchema>;
