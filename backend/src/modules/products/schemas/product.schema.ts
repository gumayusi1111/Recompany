import { z } from 'zod';
// Zod已经内置TypeScript类型，不需要安装@types/zod

/**
 * 产品数据验证模式
 */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
});

/**
 * 创建产品请求数据验证模式
 */
export const CreateProductSchema = z.object({
  name: z.string().min(1, '产品名称不能为空'),
  description: z.string().optional()
});

/**
 * 更新产品请求数据验证模式
 */
export const UpdateProductSchema = z.object({
  name: z.string().min(1, '产品名称不能为空').optional(),
  description: z.string().optional()
});
