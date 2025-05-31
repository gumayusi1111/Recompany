// Zod已经内置TypeScript类型，直接导入即可
import { z } from 'zod';
import { ProductSchema, CreateProductSchema, UpdateProductSchema } from '../schemas/product.schema';

// 产品基本类型
export type Product = z.infer<typeof ProductSchema>;

// 创建产品DTO
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

// 更新产品DTO
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

// 导出当前结构中的Products类型，以保证兼容性
export type Products = Product;
