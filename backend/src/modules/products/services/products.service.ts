import { PrismaClient } from '@prisma/client';
import { CreateProductDto, Products, UpdateProductDto } from '../types';

const prisma = new PrismaClient();

/**
 * 获取所有产品
 */
export const getAllProducts = async (): Promise<Products[]> => {
  try {
    // 使用占位数据，实际项目中应从数据库查询
    const mockProducts: Products[] = [
      { id: '1', name: '示例 - products', description: '这是一个占位数据' },
      { id: '2', name: '示例 2 - products', description: '第二条记录' }
    ];
    
    return mockProducts;
    
    // 实际数据库实现应该是：
    // return await prisma.product.findMany();
  } catch (error) {
    console.error('Error in getAllProducts service:', error);
    throw error;
  }
};

/**
 * 根据ID获取单个产品
 */
export const getProductById = async (id: string): Promise<Products | null> => {
  try {
    // 使用占位数据，实际项目中应从数据库查询
    if (id === '1') {
      return { id: '1', name: '示例 - products', description: '这是一个占位数据' };
    }
    
    if (id === '2') {
      return { id: '2', name: '示例 2 - products', description: '第二条记录' };
    }
    
    return null;
    
    // 实际数据库实现应该是：
    // return await prisma.product.findUnique({ where: { id } });
  } catch (error) {
    console.error(`Error in getProductById(${id}) service:`, error);
    throw error;
  }
};

/**
 * 创建新产品
 */
export const createProduct = async (data: CreateProductDto): Promise<Products> => {
  try {
    // 使用占位数据，实际项目中应在数据库创建
    const newProduct: Products = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description
    };
    
    return newProduct;
    
    // 实际数据库实现应该是：
    // return await prisma.product.create({ data });
  } catch (error) {
    console.error('Error in createProduct service:', error);
    throw error;
  }
};

/**
 * 更新产品信息
 */
export const updateProduct = async (id: string, data: UpdateProductDto): Promise<Products | null> => {
  try {
    // 使用占位数据，实际项目中应更新数据库
    if (id === '1' || id === '2') {
      return {
        id,
        name: data.name || `示例 ${id === '1' ? '' : '2 '}- products`,
        description: data.description || `${id === '1' ? '这是一个占位数据' : '第二条记录'}`
      };
    }
    
    return null;
    
    // 实际数据库实现应该是：
    // return await prisma.product.update({ where: { id }, data });
  } catch (error) {
    console.error(`Error in updateProduct(${id}) service:`, error);
    throw error;
  }
};

/**
 * 删除产品
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // 使用占位数据，实际项目中应删除数据库记录
    return (id === '1' || id === '2');
    
    // 实际数据库实现应该是：
    // const product = await prisma.product.delete({ where: { id } });
    // return !!product;
  } catch (error) {
    console.error(`Error in deleteProduct(${id}) service:`, error);
    throw error;
  }
};
