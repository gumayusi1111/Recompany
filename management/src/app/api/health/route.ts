/**
 * 健康检查API端点 - 简化版本
 */

import { NextRequest } from 'next/server'
import { createSuccessResponse, withErrorHandling } from '@/lib/api/utils'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'operational',
      auth: 'operational',
      storage: 'operational'
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  }

  return createSuccessResponse(healthData, '系统运行正常')
})
