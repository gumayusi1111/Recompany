/**
 * Materials模块入口
 * 统一导出所有相关组件，方便其他模块引用
 */

// 导入并导出路由
import router from './routes';

// 选择性导出类型定义（类型定义不会导致运行时冲突）
import { Material, Materials } from './types';
export { Material, Materials };

// 默认导出路由，保持与原有结构兼容
export default router;