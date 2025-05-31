import { Request, Response } from 'express';
import * as contactService from '../services';

/**
 * 获取所有联系我们数据
 */
export const getAllContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await contactService.getAllContact();
    res.json({ code: 0, msg: 'success', data: contacts });
  } catch (error) {
    console.error('Error in getAllContact:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 根据ID获取单个联系我们数据
 */
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);
    
    if (!contact) {
      res.status(404).json({ code: 404, msg: '联系我们数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: 'success', data: contact });
  } catch (error) {
    console.error('Error in getContactById:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 创建新联系我们数据
 */
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const newContact = await contactService.createContact(req.body);
    res.status(201).json({ code: 0, msg: '创建成功', data: newContact });
  } catch (error) {
    console.error('Error in createContact:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 更新联系我们数据
 */
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedContact = await contactService.updateContact(id, req.body);
    
    if (!updatedContact) {
      res.status(404).json({ code: 404, msg: '联系我们数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '更新成功', data: updatedContact });
  } catch (error) {
    console.error('Error in updateContact:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

/**
 * 删除联系我们数据
 */
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await contactService.deleteContact(id);
    
    if (!deleted) {
      res.status(404).json({ code: 404, msg: '联系我们数据不存在', data: null });
      return;
    }
    
    res.json({ code: 0, msg: '删除成功', data: null });
  } catch (error) {
    console.error('Error in deleteContact:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
  }
};
