import { Request, Response } from 'express';
import * as casesService from '../services';

/**
 * 获取所有工程案例数据
 */
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const cases = await casesService.getAllProjects();
    res.json({ code: 0, msg: 'success', data: cases });
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个工程案例
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const caseItem = await casesService.getProjectById(id);

    if (!caseItem) {
      res.status(404).json({ code: 404, msg: '工程案例不存在', data: null });
      return;
    }

    res.json({ code: 0, msg: 'success', data: caseItem });
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新工程案例
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCase = await casesService.createProject(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newCase });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新工程案例
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCase = await casesService.updateProject(id, req.body);

    if (!updatedCase) {
      res.status(404).json({ code: 404, msg: '工程案例不存在', data: null });
      return;
    }

    res.json({ code: 0, msg: '更新成功', data: updatedCase });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除工程案例
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await casesService.deleteProject(id);

    if (!deleted) {
      res.status(404).json({ code: 404, msg: '工程案例不存在', data: null });
      return;
    }

    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
