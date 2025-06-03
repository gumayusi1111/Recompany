/**
 * 联系信息管理API端点
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  validateRequestBody, 
  parseQueryParams,
  requireAuth,
  withErrorHandling,
  generateId,
  formatDate,
  calculatePagination
} from '@/lib/api/utils'
import { Contact } from '@/lib/api/types'
import { contacts } from '@/lib/data/mockData'

// 联系信息验证schema
const contactSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('邮箱格式不正确'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, '主题不能为空'),
  message: z.string().min(1, '留言内容不能为空'),
  status: z.enum(['new', 'replied', 'closed']).default('new')
})

// GET - 获取联系信息列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = parseQueryParams(request)
  
  // 过滤和搜索
  let filteredContacts = [...contacts]
  
  if (params.search) {
    filteredContacts = filteredContacts.filter(contact =>
      contact.name.toLowerCase().includes(params.search.toLowerCase()) ||
      contact.email.toLowerCase().includes(params.search.toLowerCase()) ||
      contact.subject.toLowerCase().includes(params.search.toLowerCase()) ||
      contact.message.toLowerCase().includes(params.search.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(params.search.toLowerCase()))
    )
  }
  
  if (params.status) {
    filteredContacts = filteredContacts.filter(contact => contact.status === params.status)
  }
  
  // 排序
  filteredContacts.sort((a, b) => {
    const aValue = a[params.sortBy as keyof Contact] as any
    const bValue = b[params.sortBy as keyof Contact] as any
    
    if (params.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  // 分页
  const pagination = calculatePagination(params.page, params.limit, filteredContacts.length)
  const paginatedContacts = filteredContacts.slice(pagination.offset, pagination.offset + params.limit)
  
  return createSuccessResponse({
    contacts: paginatedContacts,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  })
})

// POST - 创建新联系信息（通常来自前端表单）
export const POST = withErrorHandling(async (request: NextRequest) => {
  const validation = await validateRequestBody(request, contactSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newContact: Contact = {
    id: generateId(),
    ...validation.data,
    createdAt: formatDate(),
    updatedAt: formatDate()
  }
  
  contacts.push(newContact)
  
  return createSuccessResponse(newContact, '联系信息提交成功')
})

// PUT - 更新联系信息状态（管理员操作）
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('联系信息ID不能为空')
  }
  
  const contactIndex = contacts.findIndex(c => c.id === id)
  if (contactIndex === -1) {
    return createErrorResponse('联系信息不存在', 404)
  }
  
  const validation = await validateRequestBody(request, contactSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(contacts[contactIndex], '联系信息更新成功')
}))

// DELETE - 删除联系信息
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('联系信息ID不能为空')
  }
  
  const contactIndex = contacts.findIndex(c => c.id === id)
  if (contactIndex === -1) {
    return createErrorResponse('联系信息不存在', 404)
  }
  
  contacts.splice(contactIndex, 1)
  
  return createSuccessResponse(undefined, '联系信息删除成功')
}))
