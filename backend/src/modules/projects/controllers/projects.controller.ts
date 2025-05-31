import { Request, Response } from 'express';
import * as projectsService from '../services';

/**
 * 获取所有项目数据
 */
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await projectsService.getAllProjects();
    res.json({ code: 0, msg: 'success', data: projects });
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个项目
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await projectsService.getProjectById(id);
    
    if (!project) {
      res.status(404).json({ code: 404, msg: '项目不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: project });
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新项目
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProject = await projectsService.createProject(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newProject });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新项目
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedProject = await projectsService.updateProject(id, req.body);
    
    if (!updatedProject) {
      res.status(404).json({ code: 404, msg: '项目不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedProject });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除项目
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await projectsService.deleteProject(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '项目不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
