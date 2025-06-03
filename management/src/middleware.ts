/**
 * Next.js中间件 - 路由保护和认证检查
 */

import { NextRequest, NextResponse } from 'next/server'

// 简化的JWT验证函数（与API保持一致）
function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())

    // 检查过期时间
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

// 从Authorization header提取token
function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null

  return parts[1]
}

// 需要认证的路径
const PROTECTED_PATHS = [
  '/admin',
  '/api/admin'
]

// 公开路径（不需要认证）
const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout'
]

// 静态资源路径
const STATIC_PATHS = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons'
]

/**
 * 检查路径是否需要认证
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(path => pathname.startsWith(path))
}

/**
 * 检查路径是否为公开路径
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path))
}

/**
 * 检查路径是否为静态资源
 */
function isStaticPath(pathname: string): boolean {
  return STATIC_PATHS.some(path => pathname.startsWith(path))
}

/**
 * 记录访问日志
 */
async function logAccess(request: NextRequest, statusCode: number, responseTime: number) {
  try {
    // 获取客户端信息
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer')
    const sessionId = request.cookies.get('session-id')?.value

    // 构造日志数据
    const logData = {
      ipAddress,
      userAgent,
      referer,
      path: request.nextUrl.pathname,
      method: request.method,
      statusCode,
      responseTime,
      sessionId,
    }

    // 记录访问日志到控制台（开发环境）
    console.log('Access log:', logData)

    // 临时禁用API调用，避免错误堆积
    // TODO: 实现日志API后重新启用
    // fetch(new URL('/api/admin/logs/access', request.url), {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(logData),
    // }).catch(error => {
    //   console.error('Failed to log access:', error)
    // })
  } catch (error) {
    console.error('Access logging error:', error)
  }
}

/**
 * 主中间件函数
 */
export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl

  // 跳过静态资源
  if (isStaticPath(pathname)) {
    return NextResponse.next()
  }

  // 处理根路径重定向
  if (pathname === '/') {
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
    const responseTime = Date.now() - startTime
    logAccess(request, 301, responseTime)
    return response
  }

  // 公开路径直接通过
  if (isPublicPath(pathname)) {
    const response = NextResponse.next()
    const responseTime = Date.now() - startTime
    logAccess(request, 200, responseTime)
    return response
  }

  // 检查是否需要认证
  if (isProtectedPath(pathname)) {
    // 从cookie或Authorization header获取token
    let token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      const authHeader = request.headers.get('authorization')
      const headerToken = extractTokenFromHeader(authHeader)
      if (headerToken) {
        token = headerToken
      }
    }

    // 验证token
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      const responseTime = Date.now() - startTime
      logAccess(request, 401, responseTime)
      return response
    }

    const payload = verifyToken(token)
    if (!payload) {
      // Token无效，清除cookie并重定向到登录页
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      const responseTime = Date.now() - startTime
      logAccess(request, 401, responseTime)
      return response
    }

    // Token有效，添加用户信息到请求头
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.id?.toString() || '1')
    response.headers.set('x-user-role', payload.role || 'admin')
    response.headers.set('x-user-email', payload.email || 'admin@yahao.com')

    const responseTime = Date.now() - startTime
    logAccess(request, 200, responseTime)
    return response
  }

  // 其他路径正常处理
  const response = NextResponse.next()
  const responseTime = Date.now() - startTime
  logAccess(request, 200, responseTime)
  return response
}

/**
 * 中间件配置
 */
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes) - 让API路由自己处理认证
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
