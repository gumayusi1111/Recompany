/**
 * 前端报价请求API端点
 * 供前端用户提交报价申请
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  validateRequestBody, 
  withErrorHandling,
  generateId,
  formatDate
} from '@/lib/api/utils'

// 报价请求数据结构
interface QuoteRequest {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  projectType: string
  projectDescription: string
  budget?: string
  timeline?: string
  location?: string
  attachments: string[]
  status: 'new' | 'reviewing' | 'quoted' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  notes?: string
}

// 模拟报价请求数据
let quoteRequests: QuoteRequest[] = [
  {
    id: 1,
    name: '张经理',
    email: 'zhang@example.com',
    phone: '13800138001',
    company: '某建筑公司',
    projectType: '体育场馆',
    projectDescription: '需要为新建体育场设计和安装张拉膜结构屋顶，面积约8000平方米，要求具有良好的透光性和自洁性能。',
    budget: '500-800万',
    timeline: '6个月',
    location: '杭州市',
    attachments: ['/uploads/project-drawings-1.pdf'],
    status: 'new',
    priority: 'high',
    createdAt: '2024-01-22T09:30:00Z',
    updatedAt: '2024-01-22T09:30:00Z'
  },
  {
    id: 2,
    name: '李女士',
    email: 'li@company.com',
    phone: '13900139002',
    company: '某地产开发商',
    projectType: '商业广场',
    projectDescription: '商业广场中庭需要安装遮阳膜结构，要求美观实用，能够有效遮阳防雨。',
    budget: '100-200万',
    timeline: '3个月',
    location: '宁波市',
    attachments: [],
    status: 'reviewing',
    priority: 'medium',
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-21T10:30:00Z',
    notes: '已安排技术人员实地考察'
  },
  {
    id: 3,
    name: '王总',
    email: 'wang@factory.com',
    phone: '13700137003',
    company: '某制造企业',
    projectType: '工业厂房',
    projectDescription: '工厂需要建设大型仓储充气膜建筑，要求保温性能好，建设周期短。',
    budget: '200-300万',
    timeline: '2个月',
    location: '温州市',
    attachments: ['/uploads/site-photos-1.zip'],
    status: 'quoted',
    priority: 'medium',
    createdAt: '2024-01-18T11:20:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    notes: '已提供初步报价方案'
  }
]

// 报价请求验证schema
const quoteRequestSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('邮箱格式不正确'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, '项目类型不能为空'),
  projectDescription: z.string().min(10, '项目描述至少需要10个字符'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  location: z.string().optional(),
  attachments: z.array(z.string()).default([])
})

// POST - 提交报价请求（前端用户）
export const POST = withErrorHandling(async (request: NextRequest) => {
  const validation = await validateRequestBody(request, quoteRequestSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newQuoteRequest: QuoteRequest = {
    id: generateId(),
    ...validation.data,
    status: 'new',
    priority: 'medium',
    createdAt: formatDate(),
    updatedAt: formatDate()
  }
  
  quoteRequests.push(newQuoteRequest)
  
  // 这里可以添加邮件通知逻辑
  console.log('New quote request received:', newQuoteRequest)
  
  return createSuccessResponse(
    { 
      id: newQuoteRequest.id,
      message: '您的报价请求已提交成功，我们将在24小时内与您联系。'
    }, 
    '报价请求提交成功'
  )
})

// GET - 获取报价请求列表（管理员用）
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  let filteredRequests = [...quoteRequests]
  
  // 状态过滤
  if (status) {
    filteredRequests = filteredRequests.filter(req => req.status === status)
  }
  
  // 优先级过滤
  if (priority) {
    filteredRequests = filteredRequests.filter(req => req.priority === priority)
  }
  
  // 按创建时间倒序排列
  filteredRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  // 分页
  const offset = (page - 1) * limit
  const paginatedRequests = filteredRequests.slice(offset, offset + limit)
  
  return createSuccessResponse({
    requests: paginatedRequests,
    pagination: {
      page,
      limit,
      total: filteredRequests.length,
      totalPages: Math.ceil(filteredRequests.length / limit)
    },
    stats: {
      total: quoteRequests.length,
      new: quoteRequests.filter(req => req.status === 'new').length,
      reviewing: quoteRequests.filter(req => req.status === 'reviewing').length,
      quoted: quoteRequests.filter(req => req.status === 'quoted').length,
      closed: quoteRequests.filter(req => req.status === 'closed').length
    }
  })
})

// PUT - 更新报价请求状态（管理员用）
export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('请求ID不能为空')
  }
  
  const requestIndex = quoteRequests.findIndex(req => req.id === id)
  if (requestIndex === -1) {
    return createErrorResponse('报价请求不存在', 404)
  }
  
  const updateSchema = z.object({
    status: z.enum(['new', 'reviewing', 'quoted', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    notes: z.string().optional()
  })
  
  const validation = await validateRequestBody(request, updateSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  quoteRequests[requestIndex] = {
    ...quoteRequests[requestIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(quoteRequests[requestIndex], '报价请求更新成功')
})

// DELETE - 删除报价请求（管理员用）
export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('请求ID不能为空')
  }
  
  const requestIndex = quoteRequests.findIndex(req => req.id === id)
  if (requestIndex === -1) {
    return createErrorResponse('报价请求不存在', 404)
  }
  
  quoteRequests.splice(requestIndex, 1)
  
  return createSuccessResponse(undefined, '报价请求删除成功')
})
