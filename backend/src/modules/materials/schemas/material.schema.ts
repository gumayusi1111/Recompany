/**
 * 材料模块数据验证模式
 * 使用Zod进行数据验证和类型推断
 * 注意：Zod已经内置TypeScript类型，不需要安装@types/zod
 */
import { z } from 'zod';

/**
 * 材料基本数据结构验证模式
 */
export const MaterialSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: '材料名称是必需的',
    invalid_type_error: '材料名称必须是字符串'
  }),
  description: z.string({
    invalid_type_error: '描述必须是字符串'
  }).optional()
});

/**
 * 创建材料请求验证模式
 */
export const CreateMaterialSchema = MaterialSchema.omit({ id: true });

/**
 * 更新材料请求验证模式
 */
export const UpdateMaterialSchema = MaterialSchema.partial().omit({ id: true });

// 导出类型
export type Material = z.infer<typeof MaterialSchema>;
export type Materials = Material[];
