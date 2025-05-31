import { Request, Response } from 'express';
import * as materialsService from '../services';

/**
 * 获取所有材料数据
 */
export const getAllMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const materials = await materialsService.getAllMaterials();
    res.json({ code: 0, msg: 'success', data: materials });
  } catch (error) {
    console.error('Error in getAllMaterials:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个材料
 */
export const getMaterialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const material = await materialsService.getMaterialById(id);
    
    if (!material) {
      res.status(404).json({ code: 404, msg: '材料不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: material });
  } catch (error) {
    console.error('Error in getMaterialById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新材料
 */
export const createMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const newMaterial = await materialsService.createMaterial(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newMaterial });
  } catch (error) {
    console.error('Error in createMaterial:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新材料
 */
export const updateMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedMaterial = await materialsService.updateMaterial(id, req.body);
    
    if (!updatedMaterial) {
      res.status(404).json({ code: 404, msg: '材料不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedMaterial });
  } catch (error) {
    console.error('Error in updateMaterial:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除材料
 */
export const deleteMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await materialsService.deleteMaterial(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '材料不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteMaterial:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
