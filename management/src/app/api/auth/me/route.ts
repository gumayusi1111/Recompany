/**
 * 获取当前用户信息API
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    // 从cookie或Authorization header获取token
    let token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      const authHeader = request.headers.get('authorization')
      token = extractTokenFromHeader(authHeader) || undefined
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        error: '未提供认证token',
      }, { status: 401 })
    }

    // 验证token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Token无效或已过期',
      }, { status: 401 })
    }

    // 从数据库获取最新用户信息
    const user = await prisma.adminUser.findUnique({
      where: { 
        id: payload.userId,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在或已被禁用',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: user,
    })

  } catch (error) {
    console.error('Get user info error:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误',
    }, { status: 500 })
  }
}
