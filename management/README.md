# 亚豪膜结构管理系统

基于 Next.js 15 + TypeScript 构建的现代化管理系统，为亚豪膜结构公司提供完整的内容管理和业务操作功能。

## 🚀 项目特性

### 技术栈
- **框架**: Next.js 15 + TypeScript + App Router
- **数据库**: PostgreSQL + Prisma ORM
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **认证**: JWT认证 + 权限管理
- **数据验证**: Zod
- **UI组件**: Lucide React Icons
- **API集成**: 统一的API客户端

### 核心功能
- 🔐 **完整认证系统**: JWT认证、权限管理、会话持久化
- 🎨 **现代化UI**: 响应式设计、明暗主题切换
- 📊 **数据管理**: 完整的CRUD操作、分页、搜索、批量操作
- 🔔 **通知系统**: 全局通知和消息提示
- 🛡️ **路由保护**: 基于中间件的认证和权限检查
- 📱 **移动端适配**: 完整的移动端支持
- 🏠 **首页管理**: 轮播图、SEO标题、公司介绍管理
- 📦 **产品管理**: 完整的产品CRUD操作
- 🏗️ **案例管理**: 工程案例展示和管理
- 💬 **评价管理**: 客户评价审核和管理
- 📰 **新闻管理**: 新闻发布和编辑
- 🗂️ **材料管理**: 材料信息和规格管理
- 💬 **请求管理**: 用户咨询和报价请求处理
- ⚙️ **系统设置**: 管理员账户和网站配置

## 🛠️ 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 12+
- npm/yarn/pnpm

### 安装步骤

1. **克隆项目**
```bash
cd management
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置数据库连接：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/membrane_db"
JWT_SECRET="your-super-secret-jwt-key"
DEFAULT_ADMIN_PASSWORD="admin123456"
```

4. **数据库设置**
```bash
# 生成Prisma客户端
npm run db:generate

# 推送数据库schema
npm run db:push

# 或运行迁移
npm run db:migrate
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3001

### 默认管理员账户
- **用户名**: admin
- **密码**: admin123456
- **角色**: 超级管理员

⚠️ **首次登录后请立即修改密码！**

## 📁 项目结构

```
management/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 管理系统页面
│   │   │   ├── dashboard/     # 仪表盘
│   │   │   ├── products/      # 产品管理
│   │   │   ├── cases/         # 案例管理
│   │   │   ├── materials/     # 材料管理
│   │   │   ├── reviews/       # 评价管理
│   │   │   ├── news/          # 新闻管理
│   │   │   ├── requests/      # 用户请求
│   │   │   ├── home/          # 首页管理
│   │   │   ├── contact/       # 联系管理
│   │   │   ├── about/         # 关于管理
│   │   │   └── settings/      # 系统设置
│   │   ├── api/               # API路由
│   │   │   ├── admin/         # 管理API
│   │   │   └── auth/          # 认证API
│   │   ├── login/             # 登录页面
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/            # React组件
│   │   ├── admin/             # 管理系统专用组件
│   │   ├── ui/                # 通用UI组件
│   │   └── forms/             # 表单组件
│   ├── lib/                   # 工具库
│   │   ├── auth/              # 认证相关
│   │   ├── db/                # 数据库操作
│   │   └── utils/             # 工具函数
│   ├── stores/                # Zustand状态管理
│   │   ├── authStore.ts       # 认证状态
│   │   ├── appStore.ts        # 应用状态
│   │   └── dataStore.ts       # 数据状态
│   ├── services/              # 服务层
│   │   └── dataService.ts     # 数据服务
│   ├── config/                # 配置文件
│   │   ├── api.ts             # API配置
│   │   └── routes.ts          # 路由配置
│   ├── types/                 # TypeScript类型定义
│   └── middleware.ts          # Next.js中间件
├── prisma/
│   └── schema.prisma          # 数据库模型
├── public/                    # 静态资源
├── .env.example               # 环境变量示例
├── .env.local                 # 本地环境变量
├── package.json               # 项目配置
├── tailwind.config.js         # Tailwind配置
├── tsconfig.json              # TypeScript配置
└── next.config.ts             # Next.js配置
```

## 🔧 开发指南

### 数据库操作
```bash
# 查看数据库
npm run db:studio

# 重置数据库
npm run db:push --force-reset

# 生成迁移文件
npm run db:migrate
```

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- API 路由使用 App Router 约定

### 安全考虑
- JWT token 存储在 httpOnly cookie 中
- 所有 API 路由都有认证保护
- 输入数据使用 Zod 验证
- XSS 和 CSRF 防护
- 密码使用 bcrypt 哈希

## 📊 功能模块

### 1. 仪表盘 (`/admin/dashboard`)
- 访问统计（今日/本周/本月）
- 请求概览（待处理/处理中/已完成）
- 内容统计（产品/案例数量）
- 系统健康监控
- 快速操作入口

### 2. 首页管理 (`/admin/content/home`)
- 轮播图管理（Hero Slides）
- SEO标题设置
- 公司介绍编辑（富文本）
- 产品预览配置
- 案例预览配置

### 3. 产品管理 (`/admin/products`)
- 产品CRUD操作
- 分类管理
- 特色产品设置
- 图片上传
- 规格和特点管理

### 4. 案例管理 (`/admin/cases`)
- 案例CRUD操作
- 客户信息管理
- 项目详情编辑
- 图片集管理
- 产品关联

### 5. 请求管理 (`/admin/requests`)
- 用户咨询列表
- 状态流程管理
- 优先级设置
- 管理员回复
- 批量操作

### 6. 系统设置 (`/admin/settings`)
- 管理员账户管理
- 密码修改
- 网站基本配置
- 系统日志查看

## 🔌 API 接口

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 仪表盘
- `GET /api/admin/dashboard/stats` - 获取统计数据

### 内容管理
- `GET /api/admin/hero-slides` - 获取轮播图列表
- `POST /api/admin/hero-slides` - 创建轮播图
- `PUT /api/admin/hero-slides/[id]` - 更新轮播图
- `DELETE /api/admin/hero-slides/[id]` - 删除轮播图

### 产品管理
- `GET /api/admin/products` - 获取产品列表
- `POST /api/admin/products` - 创建产品
- `PUT /api/admin/products/[id]` - 更新产品
- `DELETE /api/admin/products/[id]` - 删除产品

### 案例管理
- `GET /api/admin/cases` - 获取案例列表
- `POST /api/admin/cases` - 创建案例
- `PUT /api/admin/cases/[id]` - 更新案例
- `DELETE /api/admin/cases/[id]` - 删除案例

## 🚀 部署指南

### 生产环境配置
1. 设置生产环境变量
2. 构建项目：`npm run build`
3. 启动服务：`npm run start`

### Docker 部署
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

### 环境变量
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📚 详细文档

查看 [FRAMEWORK_GUIDE.md](./FRAMEWORK_GUIDE.md) 获取完整的开发指南，包括：
- 详细的技术架构说明
- 状态管理使用指南
- API集成示例
- 组件开发指南
- 部署和优化建议

## 📞 支持

如有问题或建议，请联系：
- 邮箱: zhaojunxi222@gmail.com
- 电话: 13957862987

---

© 2025 亚豪膜结构工程有限公司. 保留所有权利.
