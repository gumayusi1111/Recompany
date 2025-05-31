/**
 * 联系我们模块入口文件
 * 导入路由并选择性导出类型
 */

// 导入路由
// eslint-disable-next-line no-restricted-imports
import routes from './routes';

// 选择性导出类型
export * from './types';

// 默认导出路由
export default routes;