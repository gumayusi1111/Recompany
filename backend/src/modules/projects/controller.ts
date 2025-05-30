import { Request, Response } from 'express'
import { Projects } from './schema'

export const getAllProjects = async (req: Request, res: Response) => {
  const mockData: Projects[] = [
    { id: '1', name: '示例 - projects', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - projects', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
