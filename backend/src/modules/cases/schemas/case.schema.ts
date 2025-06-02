import { z } from 'zod';

/**
 * 工程案例验证模式
 */
export const EngineeringCaseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  imagePath: z.string().optional(),
  caseType: z.string().optional(),
  area: z.string().optional(),
  clientName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 创建工程案例请求验证模式
 */
export const CreateEngineeringCaseSchema = z.object({
  name: z.string().min(1, '案例名称不能为空'),
  description: z.string().optional(),
  imagePath: z.string().url('图片路径格式不正确').optional(),
  caseType: z.string().min(1, '案例类型不能为空').optional(),
  area: z.string().optional(),
  clientName: z.string().min(1, '客户名称不能为空').optional(),
});

/**
 * 更新工程案例请求验证模式
 */
export const UpdateEngineeringCaseSchema = CreateEngineeringCaseSchema.partial();

// 导出类型
export type EngineeringCase = z.infer<typeof EngineeringCaseSchema>;
export type CreateEngineeringCaseDto = z.infer<typeof CreateEngineeringCaseSchema>;
export type UpdateEngineeringCaseDto = z.infer<typeof UpdateEngineeringCaseSchema>;

// 兼容旧类型定义
export type Case = EngineeringCase;
export type CaseList = EngineeringCase[];
export type Cases = CaseList;
