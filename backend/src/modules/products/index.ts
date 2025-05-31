/**
 * Products模块入口
 * 统一导出所有相关组件，方便其他模块引用
 */

// 导出路由
import productsRouter from './routes';
export { default as productsRouter } from './routes';

// 不再直接导出控制器、服务和模式，避免重复导出错误
// 而是选择性地从各个模块导出需要的组件
// 如果需要使用控制器、服务或模式，请直接从相应文件夹导入

// 导出类型定义（类型定义不会导致运行时冲突）
import { Product, Products } from './types';
export { Product, Products };

// 默认导出路由，保持与原有结构兼容
export default productsRouter;