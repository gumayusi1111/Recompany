import { Request, Response } from 'express'
import { Testimonials } from './schema'

export const getAllTestimonials = async (req: Request, res: Response) => {
  const mockData: Testimonials[] = [
    { id: '1', name: '示例 - testimonials', description: '这是一个占位数据' },
    { id: '2', name: '示例 2 - testimonials', description: '第二条记录' }
  ]
  res.json({ code: 0, msg: 'mock ok', data: mockData })
}
