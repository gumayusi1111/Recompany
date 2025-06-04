/**
 * 类型定义索引文件
 * 统一导出案例相关类型
 */

// 从模式文件导入类型定义
import { Case, CaseList, Project, Projects } from '../schemas/case.schema';

// 导出案例类型
export { Case, CaseList };

// 导出兼容性类型（向后兼容）
export { Project, Projects };
export type ProjectList = CaseList;
