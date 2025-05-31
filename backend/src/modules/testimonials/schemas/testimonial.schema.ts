/**
 * 证言模块数据验证模式
 * 使用Zod进行数据验证和类型推断
 */
import { z } from 'zod';

/**
 * 证言基本数据结构验证模式
 */
export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: '证言名称是必需的',
    invalid_type_error: '证言名称必须是字符串'
  }),
  description: z.string({
    invalid_type_error: '描述必须是字符串'
  }).optional()
});

/**
 * 创建证言请求验证模式
 */
export const CreateTestimonialSchema = TestimonialSchema.omit({ id: true });

/**
 * 更新证言请求验证模式
 */
export const UpdateTestimonialSchema = TestimonialSchema.partial().omit({ id: true });

// 导出类型
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type TestimonialList = Testimonial[];

// 保留与原schema.ts兼容的类型
export type Testimonials = Testimonial[];
