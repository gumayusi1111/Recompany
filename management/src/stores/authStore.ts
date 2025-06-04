/**
 * 认证状态管理
 * 使用Zustand管理用户认证状态和权限
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/api/client'
import { ADMIN_API } from '@/config/api'

// 用户信息类型
export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'super_admin'
  avatar?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// 认证状态类型
interface AuthState {
  // 状态
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // 操作
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<boolean>
  clearError: () => void
  setLoading: (loading: boolean) => void
  
  // 权限检查
  hasPermission: (permission: string) => boolean
  hasRole: (role: string | string[]) => boolean
}

// 权限映射
const ROLE_PERMISSIONS = {
  admin: [
    'dashboard.view',
    'content.view',
    'content.edit',
    'requests.view',
    'requests.manage'
  ],
  super_admin: [
    'dashboard.view',
    'content.view',
    'content.edit',
    'content.delete',
    'requests.view',
    'requests.manage',
    'settings.view',
    'settings.edit',
    'users.manage'
  ]
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials) => {
        set({ isLoading: true, error: null })

        try {
          const response = await apiClient.post(ADMIN_API.AUTH.LOGIN, credentials)

          if (response.success && response.data) {
            const { user, token } = response.data as { user: User; token: string }
            
            // 存储token到localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', token)
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })

            return true
          } else {
            set({
              isLoading: false,
              error: response.error || '登录失败'
            })
            return false
          }
        } catch (error) {
          set({
            isLoading: false,
            error: '网络错误，请稍后重试'
          })
          return false
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true })

        try {
          // 调用登出API
          await apiClient.post(ADMIN_API.AUTH.LOGOUT)
        } catch (error) {
          console.warn('登出API调用失败:', error)
        }

        // 清除本地存储
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      },

      // 刷新token
      refreshToken: async () => {
        const { token } = get()
        if (!token) return false

        try {
          const response = await apiClient.post(ADMIN_API.AUTH.REFRESH)

          if (response.success && response.data) {
            const { user, token: newToken } = response.data as { user: User; token: string }
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', newToken)
            }

            set({
              user,
              token: newToken,
              isAuthenticated: true
            })

            return true
          }
        } catch (error) {
          console.warn('Token刷新失败:', error)
        }

        return false
      },

      // 更新用户资料
      updateProfile: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const response = await apiClient.put(ADMIN_API.AUTH.ME, data)

          if (response.success && response.data) {
            set(state => ({
              user: { ...state.user!, ...(response.data as Partial<User>) },
              isLoading: false,
              error: null
            }))
            return true
          } else {
            set({
              isLoading: false,
              error: response.error || '更新失败'
            })
            return false
          }
        } catch (error) {
          set({
            isLoading: false,
            error: '网络错误，请稍后重试'
          })
          return false
        }
      },

      // 修改密码
      changePassword: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const response = await apiClient.post(ADMIN_API.AUTH.CHANGE_PASSWORD, data)

          if (response.success) {
            set({
              isLoading: false,
              error: null
            })
            return true
          } else {
            set({
              isLoading: false,
              error: response.error || '密码修改失败'
            })
            return false
          }
        } catch (error) {
          set({
            isLoading: false,
            error: '网络错误，请稍后重试'
          })
          return false
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // 权限检查
      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false

        const userPermissions = ROLE_PERMISSIONS[user.role] || []
        return userPermissions.includes(permission)
      },

      // 角色检查
      hasRole: (role) => {
        const { user } = get()
        if (!user) return false

        if (Array.isArray(role)) {
          return role.includes(user.role)
        }
        return user.role === role
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// 初始化认证状态
export const initializeAuth = async () => {
  const { token, refreshToken, logout } = useAuthStore.getState()
  
  if (token) {
    // 尝试刷新token验证有效性
    const success = await refreshToken()
    if (!success) {
      // token无效，清除认证状态
      await logout()
    }
  }
}

// 权限守卫Hook
export const usePermission = (permission: string) => {
  const hasPermission = useAuthStore(state => state.hasPermission)
  return hasPermission(permission)
}

// 角色守卫Hook
export const useRole = (role: string | string[]) => {
  const hasRole = useAuthStore(state => state.hasRole)
  return hasRole(role)
}

export default useAuthStore
