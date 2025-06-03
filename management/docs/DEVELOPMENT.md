# 开发指南

## 🏗️ 架构设计

### 技术选型理由

1. **Next.js 15 + App Router**
   - 服务端渲染 (SSR) 提升SEO和首屏加载速度
   - App Router 提供更好的路由组织和布局复用
   - 内置API路由，简化后端开发

2. **TypeScript**
   - 类型安全，减少运行时错误
   - 更好的IDE支持和代码提示
   - 便于团队协作和代码维护

3. **Prisma ORM**
   - 类型安全的数据库操作
   - 自动生成类型定义
   - 强大的迁移和schema管理

4. **Tailwind CSS**
   - 原子化CSS，提高开发效率
   - 内置响应式设计
   - 易于定制和维护

5. **JWT认证**
   - 无状态认证，便于扩展
   - 安全性高，支持过期时间
   - 适合前后端分离架构

### 项目架构

```
管理系统架构
├── 前端层 (React + Next.js)
│   ├── 页面组件 (Pages)
│   ├── 业务组件 (Components)
│   ├── 状态管理 (Zustand)
│   └── 样式系统 (Tailwind CSS)
├── API层 (Next.js API Routes)
│   ├── 认证中间件
│   ├── 业务逻辑
│   └── 数据验证 (Zod)
├── 数据层 (Prisma + PostgreSQL)
│   ├── 数据模型
│   ├── 关系定义
│   └── 查询优化
└── 基础设施
    ├── 认证系统 (JWT)
    ├── 文件上传
    ├── 日志记录
    └── 错误处理
```

## 🔧 开发环境设置

### 1. 环境要求
- Node.js 18+
- PostgreSQL 12+
- Git

### 2. 快速开始
```bash
# 运行安装脚本
chmod +x scripts/setup.sh
./scripts/setup.sh

# 或手动安装
npm install
cp .env.example .env.local
npm run db:generate
npm run db:push
npm run dev
```

### 3. 开发工具推荐
- **IDE**: VS Code
- **扩展**: 
  - Prisma
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - ES7+ React/Redux/React-Native snippets
- **数据库工具**: Prisma Studio (`npm run db:studio`)

## 📝 编码规范

### 1. 文件命名
- 组件文件: PascalCase (`UserProfile.tsx`)
- 工具文件: camelCase (`authUtils.ts`)
- 页面文件: kebab-case (`user-profile/page.tsx`)
- 常量文件: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### 2. 组件规范
```typescript
// ✅ 推荐的组件结构
interface ComponentProps {
  title: string
  isActive?: boolean
  onSubmit: (data: FormData) => void
}

export default function Component({ 
  title, 
  isActive = false, 
  onSubmit 
}: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. 事件处理函数
  const handleSubmit = () => {
    // 处理逻辑
  }
  
  // 3. 渲染逻辑
  return (
    <div className="component-wrapper">
      {/* JSX */}
    </div>
  )
}
```

### 3. API路由规范
```typescript
// ✅ 推荐的API结构
export async function GET(request: NextRequest) {
  try {
    // 1. 认证检查
    const user = await authenticateRequest(request)
    
    // 2. 参数验证
    const params = validateParams(request)
    
    // 3. 业务逻辑
    const data = await businessLogic(params)
    
    // 4. 返回响应
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 4. 数据库操作规范
```typescript
// ✅ 推荐的数据库操作
export async function getProducts(options: {
  page: number
  limit: number
  search?: string
}) {
  const { page, limit, search } = options
  
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  } : {}
  
  return await paginate(prisma.product, { page, limit }, where)
}
```

## 🔐 安全最佳实践

### 1. 认证和授权
- 使用JWT token进行认证
- Token存储在httpOnly cookie中
- 实现中间件进行路由保护
- 定期刷新token

### 2. 数据验证
- 使用Zod进行输入验证
- 前后端双重验证
- SQL注入防护（Prisma自动处理）

### 3. XSS防护
- 使用React的内置XSS防护
- 富文本内容进行sanitize
- CSP头部设置

### 4. CSRF防护
- SameSite cookie设置
- 验证Referer头部
- 使用CSRF token（如需要）

## 📊 性能优化

### 1. 前端优化
- 代码分割和懒加载
- 图片优化（Next.js Image组件）
- 缓存策略
- Bundle分析和优化

### 2. 后端优化
- 数据库查询优化
- 分页查询
- 缓存热点数据
- API响应压缩

### 3. 数据库优化
- 合理的索引设计
- 查询性能监控
- 连接池配置
- 读写分离（如需要）

## 🧪 测试策略

### 1. 单元测试
```typescript
// 使用Jest + Testing Library
import { render, screen } from '@testing-library/react'
import UserProfile from './UserProfile'

test('renders user profile', () => {
  render(<UserProfile user={mockUser} />)
  expect(screen.getByText('用户资料')).toBeInTheDocument()
})
```

### 2. 集成测试
- API端点测试
- 数据库操作测试
- 认证流程测试

### 3. E2E测试
- 关键业务流程
- 用户交互测试
- 跨浏览器兼容性

## 🚀 部署指南

### 1. 构建优化
```bash
# 生产构建
npm run build

# 分析bundle大小
npm run analyze
```

### 2. 环境配置
```env
# 生产环境变量
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
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

### 4. 监控和日志
- 应用性能监控
- 错误日志收集
- 数据库性能监控
- 用户行为分析

## 🔄 开发流程

### 1. 功能开发流程
1. 创建功能分支
2. 编写代码和测试
3. 代码审查
4. 合并到主分支
5. 部署到测试环境
6. 用户验收测试
7. 部署到生产环境

### 2. 数据库变更流程
1. 修改Prisma schema
2. 生成迁移文件
3. 在开发环境测试
4. 代码审查
5. 在测试环境验证
6. 生产环境部署

### 3. 发布流程
1. 版本号更新
2. 生成变更日志
3. 创建发布标签
4. 自动化部署
5. 监控和回滚准备

## 🐛 调试技巧

### 1. 前端调试
- React DevTools
- Chrome DevTools
- Console日志
- 网络请求监控

### 2. 后端调试
- API日志记录
- 数据库查询日志
- 性能分析
- 错误堆栈追踪

### 3. 数据库调试
- Prisma Studio
- 查询性能分析
- 慢查询日志
- 索引使用情况

## 📚 学习资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

### 最佳实践
- [React 最佳实践](https://react.dev/learn)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL 性能调优](https://wiki.postgresql.org/wiki/Performance_Optimization)

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 遵循编码规范
4. 编写测试
5. 提交Pull Request
6. 代码审查
7. 合并代码

---

如有问题，请查看 [FAQ](FAQ.md) 或联系开发团队。
