import { z } from 'zod';

/**
 * 基础首页数据验证模式
 */
const BaseHomeSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

/**
 * 创建首页数据请求验证模式
 */
export const CreateHomeSchema = BaseHomeSchema;

/**
 * 更新首页数据请求验证模式
 */
export const UpdateHomeSchema = BaseHomeSchema.partial();

/**
 * 完整首页数据验证模式
 */
export const HomeSchema = BaseHomeSchema.extend({
  id: z.string(),
});

/**
 * 首页数据类型定义
 */
export type Home = z.infer<typeof HomeSchema>;

/**
 * 首页数据列表类型定义
 */
export type HomeList = Home[];

/**
 * 兼容旧类型定义
 */
export type Homes = HomeList;
