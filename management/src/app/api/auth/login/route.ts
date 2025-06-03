/**
 * 登录API端点
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 临时使用简单的JWT实现，不依赖外部库
function generateSimpleToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = { ...payload, iat: now, exp: now + 24 * 60 * 60 } // 24小时过期

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url')
  const base64Payload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')
  const signature = Buffer.from(`${base64Header}.${base64Payload}.secret`).toString('base64url')

  return `${base64Header}.${base64Payload}.${signature}`
}

// 默认管理员账户
const DEFAULT_ADMIN = {
  id: 1,
  username: 'admin',
  password: 'admin123456',
  email: 'admin@yahao.com',
  role: 'admin'
}

// 登录请求验证schema
const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: validation.error.errors[0].message,
      }, { status: 400 })
    }

    const { username, password } = validation.data

    // 简化的用户验证（使用默认账户）
    if (username !== DEFAULT_ADMIN.username || password !== DEFAULT_ADMIN.password) {
      return NextResponse.json({
        success: false,
        error: '用户名或密码错误',
      }, { status: 401 })
    }

    // 生成JWT token
    const token = generateSimpleToken({
      id: DEFAULT_ADMIN.id,
      username: DEFAULT_ADMIN.username,
      email: DEFAULT_ADMIN.email,
      role: DEFAULT_ADMIN.role,
    })

    // 创建响应
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: DEFAULT_ADMIN.id,
          username: DEFAULT_ADMIN.username,
          email: DEFAULT_ADMIN.email,
          role: DEFAULT_ADMIN.role,
        },
        token,
      },
      message: '登录成功',
    })

    // 设置安全cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24小时
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误',
    }, { status: 500 })
  }
}
