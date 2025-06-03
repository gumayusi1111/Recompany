/**
 * JWT认证工具
 * 提供token生成、验证、解析功能
 */

import jwt from 'jsonwebtoken'
import { AdminUser, AdminRole } from '@/types/database'

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// JWT载荷接口
export interface JWTPayload {
  userId: string
  username: string
  email: string
  role: AdminRole
  iat?: number
  exp?: number
}

/**
 * 生成JWT token
 */
export function generateToken(user: Pick<AdminUser, 'id' | 'username' | 'email' | 'role'>): string {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'membrane-management',
    audience: 'membrane-admin',
  })
}

/**
 * 验证JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'membrane-management',
      audience: 'membrane-admin',
    }) as JWTPayload

    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * 解析JWT token（不验证签名，用于获取过期token的信息）
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT decode failed:', error)
    return null
  }
}

/**
 * 检查token是否即将过期（1小时内）
 */
export function isTokenExpiringSoon(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  const now = Math.floor(Date.now() / 1000)
  const timeUntilExpiry = decoded.exp - now
  const oneHour = 60 * 60

  return timeUntilExpiry < oneHour
}

/**
 * 刷新token（如果即将过期）
 */
export function refreshTokenIfNeeded(token: string, user: Pick<AdminUser, 'id' | 'username' | 'email' | 'role'>): string | null {
  if (isTokenExpiringSoon(token)) {
    return generateToken(user)
  }
  return null
}

/**
 * 从请求头中提取token
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}

/**
 * 检查用户权限
 */
export function hasPermission(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleHierarchy = {
    [AdminRole.ADMIN]: 1,
    [AdminRole.SUPER_ADMIN]: 2,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * 生成安全的随机字符串（用于session ID等）
 */
export function generateSecureRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 创建安全的cookie选项
 */
export function getSecureCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    path: '/',
  }
}
