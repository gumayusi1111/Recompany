/**
 * 工程案例模块数据验证模式
 * 使用Zod进行数据验证和类型推断
 */
import { z } from 'zod';

/**
 * 工程案例基本数据结构验证模式
 */
export const CaseSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: '工程案例名称是必需的',
    invalid_type_error: '工程案例名称必须是字符串'
  }),
  description: z.string({
    invalid_type_error: '描述必须是字符串'
  }).optional()
});

/**
 * 创建工程案例请求验证模式
 */
export const CreateCaseSchema = CaseSchema.omit({ id: true });

/**
 * 更新工程案例请求验证模式
 */
export const UpdateCaseSchema = CaseSchema.partial().omit({ id: true });

// 导出类型
export type Case = z.infer<typeof CaseSchema>;
export type CaseList = Case[];

// 保留与原schema.ts兼容的类型（向后兼容）
export const ProjectSchema = CaseSchema;
export const CreateProjectSchema = CreateCaseSchema;
export const UpdateProjectSchema = UpdateCaseSchema;
export type Project = Case;
export type Projects = Case[];
