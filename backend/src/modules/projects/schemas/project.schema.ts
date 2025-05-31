/**
 * 项目模块数据验证模式
 * 使用Zod进行数据验证和类型推断
 */
import { z } from 'zod';

/**
 * 项目基本数据结构验证模式
 */
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: '项目名称是必需的',
    invalid_type_error: '项目名称必须是字符串'
  }),
  description: z.string({
    invalid_type_error: '描述必须是字符串'
  }).optional()
});

/**
 * 创建项目请求验证模式
 */
export const CreateProjectSchema = ProjectSchema.omit({ id: true });

/**
 * 更新项目请求验证模式
 */
export const UpdateProjectSchema = ProjectSchema.partial().omit({ id: true });

// 导出类型
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectList = Project[];

// 保留与原schema.ts兼容的类型
export type Projects = Project[];
