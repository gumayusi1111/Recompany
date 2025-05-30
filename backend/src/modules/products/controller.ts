import { Request, Response } from 'express'
import { Products } from './schema'

export const getAllProducts = async (req: Request, res: Response) => {
  const mockData: Products[] = [
    { id: '1', name: '示例 - products', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - products', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
