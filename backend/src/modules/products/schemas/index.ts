export * from './product.schema';

// 导出当前结构中的Products类型，以保证兼容性
// Zod已经内置TypeScript类型，直接导入即可
import { z } from 'zod';
import { ProductSchema } from './product.schema';

export type Products = z.infer<typeof ProductSchema>;
