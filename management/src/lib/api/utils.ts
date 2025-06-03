/**
 * API工具函数
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiResponse, JwtPayload } from './types'

// 创建标准API响应
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    success,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(error && { error })
  }
}

// 创建成功响应
export function createSuccessResponse<T>(
  data?: T,
  message?: string
): NextResponse {
  return NextResponse.json(createApiResponse(true, data, message))
}

// 创建错误响应
export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse {
  return NextResponse.json(
    createApiResponse(false, undefined, undefined, error),
    { status }
  )
}

// 验证请求体
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0].message
      }
    }
    
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    return {
      success: false,
      error: '无效的JSON格式'
    }
  }
}

// 解析查询参数
export function parseQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    search: searchParams.get('search') || '',
    status: searchParams.get('status'),
    category: searchParams.get('category'),
    dateFrom: searchParams.get('dateFrom'),
    dateTo: searchParams.get('dateTo')
  }
}

// 简化的JWT验证函数
export function verifyToken(token: string): JwtPayload | null {
  try {
    // 简化的JWT解析（生产环境应使用专业库）
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    
    // 检查过期时间
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return payload as JwtPayload
  } catch (error) {
    return null
  }
}

// 从请求中获取用户信息
export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  // 从cookie获取token
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  
  return verifyToken(token)
}

// 权限检查中间件（简化版本，开发阶段可跳过认证）
export function requireAuth(handler: (request: NextRequest, user: JwtPayload) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = getUserFromRequest(request)

    // 开发阶段：如果没有有效token，使用默认用户
    if (!user) {
      const defaultUser: JwtPayload = {
        id: 1,
        username: 'admin',
        email: 'admin@yahao.com',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
      }
      return handler(request, defaultUser)
    }

    return handler(request, user)
  }
}

// 角色权限检查
export function requireRole(roles: string[]) {
  return (handler: (request: NextRequest, user: JwtPayload) => Promise<NextResponse>) => {
    return async (request: NextRequest): Promise<NextResponse> => {
      const user = getUserFromRequest(request)
      
      if (!user) {
        return createErrorResponse('未授权访问', 401)
      }
      
      if (!roles.includes(user.role)) {
        return createErrorResponse('权限不足', 403)
      }
      
      return handler(request, user)
    }
  }
}

// 错误处理包装器
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('API Error:', error)
      return createErrorResponse('服务器内部错误', 500)
    }
  }
}

// 分页计算
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  
  return {
    page,
    limit,
    total,
    totalPages,
    offset,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

// 生成模拟数据ID
export function generateId(): number {
  return Math.floor(Math.random() * 1000000) + 1
}

// 格式化日期
export function formatDate(date: Date = new Date()): string {
  return date.toISOString()
}
