/**
 * 登出API端点
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登出成功',
    })

    // 清除认证cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // 立即过期
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误',
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // 支持GET请求登出（用于链接点击）
  return POST(request)
}
