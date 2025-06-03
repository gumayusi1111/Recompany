/**
 * 密码哈希和验证工具
 * 使用bcrypt进行安全的密码处理
 */

import bcrypt from 'bcryptjs'

// 盐轮数配置
const SALT_ROUNDS = 12

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    console.error('Password hashing failed:', error)
    throw new Error('密码加密失败')
  }
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
  } catch (error) {
    console.error('Password verification failed:', error)
    return false
  }
}

/**
 * 生成安全的随机密码
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''
  
  // 确保至少包含每种类型的字符
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // 填充剩余长度
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // 打乱字符顺序
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * 验证密码强度
 */
export interface PasswordStrength {
  score: number // 0-4
  feedback: string[]
  isValid: boolean
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0
  
  // 长度检查
  if (password.length < 8) {
    feedback.push('密码长度至少需要8个字符')
  } else if (password.length >= 8) {
    score += 1
  }
  
  if (password.length >= 12) {
    score += 1
  }
  
  // 字符类型检查
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
  
  if (!hasLowercase) {
    feedback.push('密码应包含小写字母')
  }
  
  if (!hasUppercase) {
    feedback.push('密码应包含大写字母')
  }
  
  if (!hasNumbers) {
    feedback.push('密码应包含数字')
  }
  
  if (!hasSymbols) {
    feedback.push('密码应包含特殊字符')
  }
  
  // 计算字符类型得分
  const charTypeCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length
  score += charTypeCount - 1 // 最多加3分
  
  // 常见密码检查
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'root', '12345678', '1234567890'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('请避免使用常见密码')
    score = Math.max(0, score - 2)
  }
  
  // 重复字符检查
  const hasRepeatingChars = /(.)\1{2,}/.test(password)
  if (hasRepeatingChars) {
    feedback.push('避免连续重复字符')
    score = Math.max(0, score - 1)
  }
  
  // 确保得分在0-4范围内
  score = Math.min(4, Math.max(0, score))
  
  const isValid = score >= 3 && password.length >= 8 && charTypeCount >= 3
  
  if (feedback.length === 0) {
    if (score === 4) {
      feedback.push('密码强度很高')
    } else if (score === 3) {
      feedback.push('密码强度良好')
    }
  }
  
  return {
    score,
    feedback,
    isValid
  }
}

/**
 * 生成密码重置token
 */
export function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return token
}
