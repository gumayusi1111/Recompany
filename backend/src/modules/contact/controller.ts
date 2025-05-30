import { Request, Response } from 'express'
import { Contact } from './schema'

export const getAllContact = async (req: Request, res: Response) => {
  const mockData: Contact[] = [
    { id: '1', name: '示例 - contact', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - contact', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
