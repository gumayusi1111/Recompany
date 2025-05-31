/**
 * 新闻模块数据验证模式
 * 使用Zod进行数据验证和类型推断
 */
import { z } from 'zod';

/**
 * 新闻基本数据结构验证模式
 */
export const NewsSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: '新闻标题是必需的',
    invalid_type_error: '新闻标题必须是字符串'
  }),
  description: z.string({
    invalid_type_error: '描述必须是字符串'
  }).optional()
});

/**
 * 创建新闻请求验证模式
 */
export const CreateNewsSchema = NewsSchema.omit({ id: true });

/**
 * 更新新闻请求验证模式
 */
export const UpdateNewsSchema = NewsSchema.partial().omit({ id: true });

// 导出类型
export type NewsItem = z.infer<typeof NewsSchema>;
export type NewsItems = NewsItem[];

// 保留与原schema.ts兼容的类型（避免其他文件修改）
export type News = NewsItem;
