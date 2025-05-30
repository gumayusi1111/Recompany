import { Request, Response } from 'express'
import { News } from './schema'

export const getAllNews = async (req: Request, res: Response) => {
  const mockData: News[] = [
    { id: '1', name: '示例 - news', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - news', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
