import { Request, Response } from 'express'
import { About } from './schema'

export const getAllAbout = async (req: Request, res: Response) => {
  const mockData: About[] = [
    { id: '1', name: '示例 - about', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - about', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
