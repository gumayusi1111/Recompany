/**
 * News模块入口
 * 统一导出所有相关组件，方便其他模块引用
 */

// 导入并导出路由
import router from './routes';

// 选择性导出类型定义
// 注意同时导出了原有News类型和新的NewsItem、NewsItems类型，保持兼容性
import { News, NewsItem, NewsItems } from './types';
export { News, NewsItem, NewsItems };

// 默认导出路由
export default router;