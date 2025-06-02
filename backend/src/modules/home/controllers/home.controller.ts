import { Request, Response } from 'express';
import * as homeService from '../services';

/**
 * 获取所有首页数据
 */
export const getAllHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const homes = await homeService.getAllHome();
    res.json({ code: 0, msg: 'success', data: homes });
  } catch (error) {
    console.error('Error in getAllHome:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个首页数据
 */
export const getHomeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const home = await homeService.getHomeById(id);
    
    if (!home) {
      res.status(404).json({ code: 404, msg: '首页数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: home });
  } catch (error) {
    console.error('Error in getHomeById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新首页数据（创建默认首页）
 */
export const createHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const newHome = await homeService.createHome();
    res.status(201).json({ code: 0, msg: '创建成功', data: newHome });
  } catch (error) {
    console.error('Error in createHome:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新首页数据
 */
export const updateHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedHome = await homeService.updateHome(id, req.body);
    
    if (!updatedHome) {
      res.status(404).json({ code: 404, msg: '首页数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedHome });
  } catch (error) {
    console.error('Error in updateHome:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除首页数据
 */
export const deleteHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await homeService.deleteHome(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '首页数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteHome:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
