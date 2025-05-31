/**
 * Home模块入口
 * 统一导出所有相关组件，方便其他模块引用
 */

// 导入并导出路由
import router from './routes';

// 选择性导出类型定义
// 同时保留原有类型名称，确保兼容性
import { Home, HomeList, Homes } from './types';
export { Home, HomeList, Homes };

// 默认导出路由
export default router;