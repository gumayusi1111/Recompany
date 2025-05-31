import { Request, Response } from 'express';
import * as testimonialsService from '../services';

/**
 * 获取所有证言数据
 */
export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await testimonialsService.getAllTestimonials();
    res.json({ code: 0, msg: 'success', data: testimonials });
  } catch (error) {
    console.error('Error in getAllTestimonials:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个证言
 */
export const getTestimonialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await testimonialsService.getTestimonialById(id);
    
    if (!testimonial) {
      res.status(404).json({ code: 404, msg: '证言不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: testimonial });
  } catch (error) {
    console.error('Error in getTestimonialById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新证言
 */
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTestimonial = await testimonialsService.createTestimonial(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newTestimonial });
  } catch (error) {
    console.error('Error in createTestimonial:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新证言
 */
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedTestimonial = await testimonialsService.updateTestimonial(id, req.body);
    
    if (!updatedTestimonial) {
      res.status(404).json({ code: 404, msg: '证言不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedTestimonial });
  } catch (error) {
    console.error('Error in updateTestimonial:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除证言
 */
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await testimonialsService.deleteTestimonial(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '证言不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteTestimonial:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
