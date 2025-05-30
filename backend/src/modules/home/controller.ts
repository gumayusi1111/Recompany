import { Request, Response } from 'express'
import { Home } from './schema'

export const getAllHome = async (req: Request, res: Response) => {
  const mockData: Home[] = [
    { id: '1', name: '示例 - home', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - home', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
