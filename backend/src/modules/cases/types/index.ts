/**
 * 案例模块类型定义索引文件
 * 统一导出案例相关类型
 */

// 从模式文件导入类型定义
import { 
  EngineeringCase, 
  CreateEngineeringCaseDto, 
  UpdateEngineeringCaseDto,
  Case,
  CaseList,
  Cases
} from '../schemas/case.schema';

// 导出类型，包括保持与原有类型系统的兼容性
export { 
  EngineeringCase, 
  CreateEngineeringCaseDto, 
  UpdateEngineeringCaseDto,
  Case,
  CaseList,
  Cases
};
