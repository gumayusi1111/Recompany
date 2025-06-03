/**
 * 验证token API端点
 */

import { NextRequest } from 'next/server'
import { createSuccessResponse, createErrorResponse, getUserFromRequest } from '@/lib/api/utils'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return createErrorResponse('Token无效或已过期', 401)
    }

    return createSuccessResponse({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, 'Token验证成功')

  } catch (error) {
    console.error('Verify error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
