import { Request, Response } from 'express';
import * as aboutService from '../services';

/**
 * 获取所有关于我们数据
 */
export const getAllAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const abouts = await aboutService.getAllAbout();
    res.json({ code: 0, msg: 'success', data: abouts });
  } catch (error) {
    console.error('Error in getAllAbout:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个关于我们数据
 */
export const getAboutById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const about = await aboutService.getAboutById(id);
    
    if (!about) {
      res.status(404).json({ code: 404, msg: '关于我们数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: about });
  } catch (error) {
    console.error('Error in getAboutById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新关于我们数据
 */
export const createAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const newAbout = await aboutService.createAbout(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newAbout });
  } catch (error) {
    console.error('Error in createAbout:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新关于我们数据
 */
export const updateAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedAbout = await aboutService.updateAbout(id, req.body);
    
    if (!updatedAbout) {
      res.status(404).json({ code: 404, msg: '关于我们数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedAbout });
  } catch (error) {
    console.error('Error in updateAbout:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除关于我们数据
 */
export const deleteAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await aboutService.deleteAbout(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '关于我们数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteAbout:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
