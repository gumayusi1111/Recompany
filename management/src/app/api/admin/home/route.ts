/**
 * 首页管理API端点
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  validateRequestBody, 
  requireAuth,
  withErrorHandling,
  formatDate
} from '@/lib/api/utils'

// 首页内容数据结构
interface HomeContent {
  id: number
  section: string
  title: string
  content: string
  images: string[]
  settings: Record<string, any>
  isActive: boolean
  updatedAt: string
  updatedBy: number
}

// 模拟首页内容数据
let homeContent: HomeContent[] = [
  {
    id: 1,
    section: 'hero',
    title: '专业膜结构工程解决方案',
    content: '亚豪膜结构成立于1994年，专注于张拉膜、充气膜、索膜结构等领域，为客户提供从设计到施工的一站式服务。',
    images: ['/images/hero/banner-1.jpg', '/images/hero/banner-2.jpg'],
    settings: {
      buttonText: '了解更多',
      buttonLink: '/about',
      showStats: true,
      stats: {
        projects: '500+',
        experience: '30年',
        clients: '200+'
      }
    },
    isActive: true,
    updatedAt: '2024-01-20T10:00:00Z',
    updatedBy: 1
  },
  {
    id: 2,
    section: 'about',
    title: '关于亚豪膜结构',
    content: '我们是一家专业的膜结构工程公司，拥有30年的行业经验。公司位于宁波市海曙区镇明路108号，致力于为客户提供高质量的膜结构解决方案。',
    images: ['/images/about/company-1.jpg'],
    settings: {
      layout: '60-40',
      showTimeline: true,
      highlights: [
        '30年行业经验',
        '500+成功项目',
        '专业技术团队',
        '一站式服务'
      ]
    },
    isActive: true,
    updatedAt: '2024-01-18T14:30:00Z',
    updatedBy: 1
  },
  {
    id: 3,
    section: 'services',
    title: '我们的服务',
    content: '提供张拉膜结构、充气膜建筑、索膜结构等专业服务，涵盖设计、制造、安装、维护全流程。',
    images: [],
    settings: {
      showGrid: true,
      services: [
        {
          name: '张拉膜结构',
          description: '大跨度建筑覆盖解决方案',
          icon: 'tensile'
        },
        {
          name: '充气膜建筑',
          description: '节能环保建筑系统',
          icon: 'pneumatic'
        },
        {
          name: '索膜结构',
          description: '景观遮阳结构设计',
          icon: 'cable'
        }
      ]
    },
    isActive: true,
    updatedAt: '2024-01-15T09:20:00Z',
    updatedBy: 1
  },
  {
    id: 4,
    section: 'contact',
    title: '联系我们',
    content: '欢迎咨询膜结构工程项目，我们将为您提供专业的技术支持和优质的服务。',
    images: [],
    settings: {
      phone: '13957862987',
      email: 'zhaojunxi222@gmail.com',
      address: '宁波市海曙区镇明路108号',
      workingHours: '周一至周五 8:00-18:00',
      showMap: true
    },
    isActive: true,
    updatedAt: '2024-01-12T16:45:00Z',
    updatedBy: 1
  }
]

// 首页内容验证schema
const homeContentSchema = z.object({
  section: z.string().min(1, '版块名称不能为空'),
  title: z.string().min(1, '标题不能为空'),
  content: z.string().min(1, '内容不能为空'),
  images: z.array(z.string()).default([]),
  settings: z.record(z.any()).default({}),
  isActive: z.boolean().default(true)
})

// GET - 获取首页内容
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')
  
  let filteredContent = [...homeContent]
  
  // 按版块过滤
  if (section) {
    filteredContent = filteredContent.filter(item => item.section === section)
  }
  
  // 只返回激活的内容
  const activeOnly = searchParams.get('active') === 'true'
  if (activeOnly) {
    filteredContent = filteredContent.filter(item => item.isActive)
  }
  
  return createSuccessResponse({
    content: filteredContent,
    total: filteredContent.length
  })
})

// PUT - 更新首页内容
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('内容ID不能为空')
  }
  
  const contentIndex = homeContent.findIndex(item => item.id === id)
  if (contentIndex === -1) {
    return createErrorResponse('内容不存在', 404)
  }
  
  const validation = await validateRequestBody(request, homeContentSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  homeContent[contentIndex] = {
    ...homeContent[contentIndex],
    ...validation.data,
    updatedAt: formatDate(),
    updatedBy: user.id
  }
  
  return createSuccessResponse(homeContent[contentIndex], '首页内容更新成功')
}))

// POST - 创建新的首页内容版块
export const POST = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const validation = await validateRequestBody(request, homeContentSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newContent: HomeContent = {
    id: Math.max(...homeContent.map(item => item.id)) + 1,
    ...validation.data,
    images: validation.data.images || [],
    isActive: validation.data.isActive ?? true,
    settings: validation.data.settings || {},
    updatedAt: formatDate(),
    updatedBy: user.id
  }
  
  homeContent.push(newContent)
  
  return createSuccessResponse(newContent, '首页内容创建成功')
}))

// DELETE - 删除首页内容版块
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('内容ID不能为空')
  }
  
  const contentIndex = homeContent.findIndex(item => item.id === id)
  if (contentIndex === -1) {
    return createErrorResponse('内容不存在', 404)
  }
  
  homeContent.splice(contentIndex, 1)
  
  return createSuccessResponse(undefined, '首页内容删除成功')
}))
