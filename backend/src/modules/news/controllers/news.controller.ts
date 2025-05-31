import { Request, Response } from 'express';
import * as newsService from '../services';

/**
 * 获取所有新闻数据
 */
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await newsService.getAllNews();
    res.json({ code: 0, msg: 'success', data: news });
  } catch (error) {
    console.error('Error in getAllNews:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个新闻
 */
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const newsItem = await newsService.getNewsById(id);
    
    if (!newsItem) {
      res.status(404).json({ code: 404, msg: '新闻不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: newsItem });
  } catch (error) {
    console.error('Error in getNewsById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新闻
 */
export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const newNews = await newsService.createNews(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newNews });
  } catch (error) {
    console.error('Error in createNews:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新新闻
 */
export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedNews = await newsService.updateNews(id, req.body);
    
    if (!updatedNews) {
      res.status(404).json({ code: 404, msg: '新闻不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedNews });
  } catch (error) {
    console.error('Error in updateNews:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除新闻
 */
export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await newsService.deleteNews(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '新闻不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteNews:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
