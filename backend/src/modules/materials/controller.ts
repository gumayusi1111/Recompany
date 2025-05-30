import { Request, Response } from 'express'
import { Materials } from './schema'

export const getAllMaterials = async (req: Request, res: Response) => {
  const mockData: Materials[] = [
    { id: '1', name: '示例 - materials', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - materials', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
