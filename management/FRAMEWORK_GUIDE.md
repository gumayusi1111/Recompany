# 管理系统框架完整指南

## 📋 项目概述

本项目是基于 Next.js 15 + TypeScript 构建的现代化管理系统，为亚豪膜结构公司提供完整的内容管理和业务操作功能。

### 🎯 核心特性

- ✅ **完整的认证系统**：JWT认证、权限管理、会话持久化
- ✅ **统一状态管理**：Zustand驱动的全局状态管理
- ✅ **API集成框架**：统一的API客户端和错误处理
- ✅ **响应式设计**：支持桌面端和移动端
- ✅ **主题切换**：支持明暗主题切换
- ✅ **数据管理**：完整的CRUD操作框架
- ✅ **通知系统**：全局通知和消息提示
- ✅ **路由保护**：基于中间件的路由认证

## 🏗️ 技术架构

### 前端技术栈
```
Next.js 15 (App Router)
TypeScript
Tailwind CSS 4
Zustand (状态管理)
Lucide React (图标)
```

### 后端集成
```
RESTful API
JWT认证
统一响应格式
错误处理机制
```

## 📁 项目结构

```
management/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 管理系统路由
│   │   │   ├── dashboard/     # 仪表盘
│   │   │   ├── products/      # 产品管理
│   │   │   ├── cases/         # 案例管理
│   │   │   ├── materials/     # 材料管理
│   │   │   ├── reviews/       # 评价管理
│   │   │   ├── news/          # 新闻管理
│   │   │   ├── requests/      # 用户请求
│   │   │   ├── home/          # 首页管理
│   │   │   ├── contact/       # 联系管理
│   │   │   └── about/         # 关于管理
│   │   ├── login/             # 登录页面
│   │   └── layout.tsx         # 根布局
│   ├── components/            # 组件库
│   │   ├── admin/             # 管理系统组件
│   │   │   ├── AdminSidebar/  # 侧边栏
│   │   │   ├── AdminHeader/   # 顶部导航
│   │   │   ├── DataTable/     # 数据表格
│   │   │   └── PageHeader/    # 页面头部
│   │   └── ui/                # 基础UI组件
│   ├── stores/                # 状态管理
│   │   ├── authStore.ts       # 认证状态
│   │   ├── appStore.ts        # 应用状态
│   │   └── dataStore.ts       # 数据状态
│   ├── services/              # 服务层
│   │   └── dataService.ts     # 数据服务
│   ├── lib/                   # 工具库
│   │   └── api/               # API客户端
│   ├── config/                # 配置文件
│   │   ├── api.ts             # API配置
│   │   └── routes.ts          # 路由配置
│   └── middleware.ts          # 中间件
├── public/                    # 静态资源
└── package.json
```

## 🔧 核心模块详解

### 1. 认证系统 (`stores/authStore.ts`)

```typescript
// 主要功能
- 用户登录/登出
- Token管理和刷新
- 权限检查
- 用户信息管理

// 使用示例
const { login, logout, user, isAuthenticated } = useAuthStore()
```

### 2. API客户端 (`lib/api/client.ts`)

```typescript
// 主要功能
- 统一的HTTP请求封装
- 自动认证处理
- 错误重试机制
- 请求/响应拦截器

// 使用示例
const response = await apiClient.get('/api/admin/products')
```

### 3. 数据管理 (`stores/dataStore.ts`)

```typescript
// 主要功能
- 产品、案例、材料等数据管理
- 分页和搜索
- 批量操作
- 状态同步

// 使用示例
const { products, fetchProducts, deleteProduct } = useDataStore()
```

### 4. 通用组件 (`components/admin/DataTable.tsx`)

```typescript
// 主要功能
- 数据展示和分页
- 排序和筛选
- 批量操作
- 响应式设计

// 使用示例
<DataTable
  columns={columns}
  data={data}
  pagination={pagination}
  onPageChange={handlePageChange}
/>
```

## 🚀 快速开始

### 1. 环境准备

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问管理系统
http://localhost:3001
```

### 2. 默认账户

```
用户名: admin
密码: admin123456
```

### 3. 开发流程

1. **创建新页面**
   ```typescript
   // 1. 在 app/admin/ 下创建新路由
   // 2. 使用 setPageMeta 设置页面信息
   // 3. 集成数据管理和API调用
   ```

2. **添加新数据类型**
   ```typescript
   // 1. 在 dataStore.ts 中定义类型和状态
   // 2. 在 dataService.ts 中创建服务类
   // 3. 在 api.ts 中配置API端点
   ```

3. **创建新组件**
   ```typescript
   // 1. 在 components/ 下创建组件
   // 2. 使用 TypeScript 定义 props
   // 3. 集成主题和响应式设计
   ```

## 📊 API集成指南

### 1. API配置 (`config/api.ts`)

```typescript
export const ADMIN_API = {
  PRODUCTS: {
    LIST: '/api/admin/products',
    CREATE: '/api/admin/products',
    UPDATE: (id: string) => `/api/admin/products/${id}`,
    DELETE: (id: string) => `/api/admin/products/${id}`,
    BULK: '/api/admin/products/bulk'
  }
  // ... 其他API端点
}
```

### 2. 统一响应格式

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

### 3. 错误处理

```typescript
// 自动错误处理
try {
  const response = await apiClient.get('/api/admin/products')
  if (response.success) {
    // 处理成功响应
  } else {
    // 错误会自动显示通知
  }
} catch (error) {
  // 网络错误会自动处理
}
```

## 🎨 主题系统

### 1. 主题配置

```typescript
// 支持的主题
type Theme = 'light' | 'dark' | 'system'

// 主题切换
const { theme, setTheme } = useAppStore()
setTheme('dark')
```

### 2. CSS变量

```css
/* 明亮主题 */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
}

/* 暗黑主题 */
[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --border-color: #374151;
}
```

## 🔐 权限系统

### 1. 角色定义

```typescript
type Role = 'admin' | 'super_admin'

// 权限映射
const ROLE_PERMISSIONS = {
  admin: ['content.view', 'content.edit'],
  super_admin: ['content.view', 'content.edit', 'content.delete', 'users.manage']
}
```

### 2. 权限检查

```typescript
// 在组件中检查权限
const hasPermission = usePermission('content.edit')
const hasRole = useRole('admin')

// 在页面中使用
if (hasPermission) {
  // 显示编辑按钮
}
```

## 📱 响应式设计

### 1. 断点配置

```css
/* Tailwind CSS 断点 */
sm: 640px   /* 小屏幕 */
md: 768px   /* 中等屏幕 */
lg: 1024px  /* 大屏幕 */
xl: 1280px  /* 超大屏幕 */
```

### 2. 移动端适配

```typescript
// 移动端检测
const { mobileSidebarOpen, setMobileSidebarOpen } = useAppStore()

// 响应式组件
<div className="hidden lg:block">桌面端内容</div>
<div className="lg:hidden">移动端内容</div>
```

## 🧪 测试指南

### 1. 组件测试

```typescript
// 测试组件渲染
import { render, screen } from '@testing-library/react'
import { DataTable } from '@/components/admin/DataTable'

test('renders data table', () => {
  render(<DataTable columns={[]} data={[]} />)
  expect(screen.getByText('暂无数据')).toBeInTheDocument()
})
```

### 2. API测试

```typescript
// 测试API调用
import { apiClient } from '@/lib/api/client'

test('fetches products', async () => {
  const response = await apiClient.get('/api/admin/products')
  expect(response.success).toBe(true)
})
```

## 🚀 部署指南

### 1. 构建项目

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 2. 环境变量

```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_FRONTEND_URL=https://example.com
JWT_SECRET=your-jwt-secret
```

### 3. Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 性能优化

### 1. 代码分割

```typescript
// 动态导入
const LazyComponent = lazy(() => import('./LazyComponent'))

// 路由级别分割
const ProductsPage = lazy(() => import('./admin/products/page'))
```

### 2. 缓存策略

```typescript
// API响应缓存
const response = await apiClient.get('/api/admin/products', {
  cache: 'force-cache',
  next: { revalidate: 60 }
})
```

## 🔧 扩展指南

### 1. 添加新的管理模块

1. 在 `app/admin/` 下创建新路由目录
2. 在 `dataStore.ts` 中添加相关状态管理
3. 在 `dataService.ts` 中创建服务类
4. 在 `config/routes.ts` 中添加路由配置
5. 更新侧边栏导航

### 2. 集成第三方服务

1. 在 `services/` 下创建服务文件
2. 在 `config/` 下添加配置
3. 在组件中使用服务
4. 添加错误处理和加载状态

## 📞 技术支持

如有问题或需要技术支持，请联系：

- 📧 邮箱：zhaojunxi222@gmail.com
- 📱 电话：13957862987
- 🏢 地址：宁波市海曙区镇明路108号

## 🔗 后端API集成示例

### 1. 产品管理API实现

```typescript
// backend/api/admin/products/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.product.count()

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '获取产品列表失败'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod验证
    const validatedData = productSchema.parse(body)

    const product = await prisma.product.create({
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: '产品创建成功'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '数据验证失败',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: '创建产品失败'
    }, { status: 500 })
  }
}
```

### 2. 认证中间件

```typescript
// backend/middleware/auth.ts
export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return res.status(401).json({
          success: false,
          error: '未提供认证令牌'
        })
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET!)
      req.user = payload

      return handler(req, res)
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: '认证失败'
      })
    }
  }
}
```

### 3. 数据验证Schema

```typescript
// backend/schemas/product.ts
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, '产品名称不能为空'),
  description: z.string().min(1, '产品描述不能为空'),
  category: z.string().min(1, '产品分类不能为空'),
  price: z.number().optional(),
  imagePath: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  specifications: z.record(z.any()).optional()
})

export type ProductInput = z.infer<typeof productSchema>
```

---

**© 2025 亚豪膜结构工程有限公司. 保留所有权利.**
