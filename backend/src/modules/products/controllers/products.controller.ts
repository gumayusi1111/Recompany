import { Request, Response } from 'express';
import { Products } from '../schemas';
import * as productService from '../services';

/**
 * 获取所有产品列表
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.json({ code: 0, msg: 'success', data: products });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ code: 500, msg: 'Internal server error', data: null });
  }
};

/**
 * 根据ID获取单个产品
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      res.status(404).json({ code: 404, msg: 'Product not found', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: product });
  } catch (error) {
    console.error(`Error in getProductById(${req.params.id}):`, error);
    res.status(500).json({ code: 500, msg: 'Internal server error', data: null });
  }
};

/**
 * 创建新产品
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ code: 0, msg: 'Product created successfully', data: newProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ code: 500, msg: 'Internal server error', data: null });
  }
};

/**
 * 更新产品信息
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const updatedProduct = await productService.updateProduct(id, productData);
    
    if (!updatedProduct) {
      res.status(404).json({ code: 404, msg: 'Product not found', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    console.error(`Error in updateProduct(${req.params.id}):`, error);
    res.status(500).json({ code: 500, msg: 'Internal server error', data: null });
  }
};

/**
 * 删除产品
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await productService.deleteProduct(id);
    
    if (!success) {
      res.status(404).json({ code: 404, msg: 'Product not found', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'Product deleted successfully', data: { id } });
  } catch (error) {
    console.error(`Error in deleteProduct(${req.params.id}):`, error);
    res.status(500).json({ code: 500, msg: 'Internal server error', data: null });
  }
};
