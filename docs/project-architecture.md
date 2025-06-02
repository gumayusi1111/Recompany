# 🏗️ 项目架构全览文档

## 📖 目录
1. [技术栈概览](#技术栈概览)
2. [项目结构](#项目结构)
3. [Docker容器架构](#docker容器架构)
4. [数据库配置](#数据库配置)
5. [API路由规范](#api路由规范)
6. [开发环境配置](#开发环境配置)

---

## 💻 技术栈概览

### 前端技术栈
```
Next.js 15.3.3          # React全栈框架
├── React 18             # UI库
├── TypeScript           # 类型安全
├── Tailwind CSS         # 样式框架
└── Node.js 20           # 运行环境
```

### 后端技术栈
```
Express.js 5.1.0         # Web框架
├── TypeScript           # 类型安全
├── Prisma ORM           # 数据库ORM
├── Zod                  # 数据验证
├── Swagger              # API文档
└── Node.js 20           # 运行环境
```

### 数据库技术栈
```
PostgreSQL 15            # 主数据库
├── Prisma Client        # 数据库客户端
├── Prisma Migrate       # 数据库迁移
└── Prisma Studio        # 可视化管理工具
```

### 基础设施
```
Docker & Docker Compose  # 容器化
├── Nginx                # 反向代理
├── Make                 # 构建工具
└── Git                  # 版本控制
```

---

## 📁 项目结构

### 根目录结构
```
company_Re/
├── frontend/            # 前端应用
├── backend/             # 后端API
├── docs/                # 项目文档
├── docker-compose.yml   # Docker配置
├── env.dev             # 开发环境变量
├── env.prod            # 生产环境变量
├── makefile            # 构建命令
└── README.md           # 项目说明
```

### 前端目录结构
```
frontend/
├── src/
│   ├── pages/          # Next.js页面
│   │   ├── index.tsx   # 首页
│   │   └── api/        # API路由
│   ├── components/     # React组件
│   ├── styles/         # 样式文件
│   └── utils/          # 工具函数
├── public/             # 静态资源
├── package.json        # 依赖配置
├── next.config.js      # Next.js配置
├── tailwind.config.js  # Tailwind配置
└── Dockerfile          # Docker构建文件
```

### 后端目录结构
```
backend/
├── src/
│   ├── app.ts          # Express应用入口
│   ├── server.ts       # 服务器启动文件
│   ├── lib/
│   │   └── prisma.ts   # Prisma客户端
│   ├── modules/        # 业务模块
│   │   ├── home/       # 首页模块
│   │   │   ├── controllers/  # 控制器
│   │   │   ├── services/     # 业务逻辑
│   │   │   ├── schemas/      # Zod验证
│   │   │   ├── routes/       # 路由定义
│   │   │   └── types/        # 类型定义
│   │   └── cases/      # 案例模块
│   └── routes/         # 全局路由
├── prisma/
│   ├── schema.prisma   # 数据库模型
│   ├── migrations/     # 迁移文件
│   └── init.sql        # 初始化SQL
├── dist/               # 编译输出
├── package.json        # 依赖配置
├── tsconfig.json       # TypeScript配置
└── Dockerfile          # Docker构建文件
```

---

## 🐳 Docker容器架构

### 服务依赖关系
```
┌─────────────────┐
│   Nginx :80     │ ← 入口点，反向代理
└─────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Frontend│ │Backend│
│ :3000  │ │ :3001 │
└───────┘ └───┬───┘
              │
         ┌────▼────┐
         │Database │
         │ :5432   │
         └─────────┘
```

### 容器配置详情

#### 1. 数据库容器 (db)
```yaml
服务名: db
镜像: postgres:15
端口映射: 5432:5432
环境变量:
  - POSTGRES_USER: postgres
  - POSTGRES_PASSWORD: postgres
  - POSTGRES_DB: company_re
数据卷: postgres_data:/var/lib/postgresql/data
健康检查: pg_isready -U postgres -d company_re
```

#### 2. 后端容器 (backend)
```yaml
服务名: backend
构建路径: ./backend
端口映射: 3001:3001
环境变量: 从env.dev/env.prod加载
依赖服务: db (等待健康检查通过)
挂载卷: ./backend:/app (开发环境)
健康检查: wget http://localhost:3001/api/health
```

#### 3. 前端容器 (frontend)
```yaml
服务名: frontend
构建路径: ./frontend
端口映射: 3000:3000
环境变量: 从env.dev/env.prod加载
挂载卷: ./frontend:/app (开发环境)
健康检查: wget http://localhost:3000
```

#### 4. 反向代理容器 (nginx)
```yaml
服务名: nginx
镜像: nginx:latest
端口映射: 80:80, 443:443
配置文件: ./nginx/nginx.conf
依赖服务: frontend, backend
```

### 数据卷管理
```
postgres_data:          # 数据库数据持久化
  - 位置: Docker管理的卷
  - 用途: PostgreSQL数据存储
  - 备份: docker volume backup

开发环境挂载:
  - ./frontend:/app      # 前端代码热重载
  - ./backend:/app       # 后端代码热重载
  - /app/node_modules    # 排除node_modules
```

---

## 🗄️ 数据库配置

### 连接信息
```
数据库名称: company_re
用户名: postgres
密码: postgres
主机: 
  - 容器内: db:5432
  - 容器外: localhost:5432
编码: UTF-8
时区: Asia/Shanghai
```

### 连接字符串格式
```bash
# 开发环境 - 容器外访问（Prisma命令）
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re

# 开发环境 - 容器内访问（应用运行时）
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re

# 生产环境
DATABASE_URL=postgresql://username:password@production-host:5432/company_re
```

### 数据库表结构
```
当前数据库表:
├── homepage                 # 首页主表
├── homepage_seo            # SEO区域
├── company_intro           # 公司介绍
├── banner_slide            # 轮播图
├── product_center          # 产品中心
├── engineering_case_center # 案例中心
├── homepage_product        # 首页产品关联
└── homepage_case           # 首页案例关联
```

### Prisma配置
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🛣️ API路由规范

### 路由结构
```
API Base URL: http://localhost:3001/api

路由格式:
/api/{module}/{resource}/{action?}

示例:
/api/health              # 健康检查
/api/home/seo           # 首页SEO管理
/api/home/banners       # 轮播图管理
/api/home/company-intro # 公司介绍管理
/api/cases              # 案例管理
```

### HTTP方法规范
```
GET    /api/resource     # 获取资源列表
GET    /api/resource/:id # 获取单个资源
POST   /api/resource     # 创建新资源
PUT    /api/resource/:id # 更新整个资源
PATCH  /api/resource/:id # 部分更新资源
DELETE /api/resource/:id # 删除资源
```

### 响应格式标准
```typescript
// 成功响应
{
  "success": true,
  "data": any,
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": any
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 状态码规范
```
200 OK           # 请求成功
201 Created      # 资源创建成功
400 Bad Request  # 请求参数错误
401 Unauthorized # 未授权
403 Forbidden    # 禁止访问
404 Not Found    # 资源不存在
500 Server Error # 服务器内部错误
```

---

## ⚙️ 开发环境配置

### 环境变量文件

#### env.dev (开发环境)
```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re

# 服务端口
PORT=3001
FRONTEND_PORT=3000

# 环境标识
NODE_ENV=development

# 日志级别
LOG_LEVEL=debug
```

#### env.prod (生产环境)
```bash
# 数据库配置
DATABASE_URL=postgresql://username:password@production-host:5432/company_re

# 服务端口
PORT=3001
FRONTEND_PORT=3000

# 环境标识
NODE_ENV=production

# 日志级别
LOG_LEVEL=info

# 安全配置
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://yourdomain.com
```

#### backend/.env (Prisma专用)
```bash
# 用于Prisma命令的数据库连接
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re
```

### 服务地址配置
```
开发环境:
├── 前端: http://localhost:3000
├── 后端: http://localhost:3001
├── 数据库: localhost:5432
├── Prisma Studio: http://localhost:5555
└── Nginx: http://localhost:80

生产环境:
├── 前端: https://yourdomain.com
├── 后端: https://api.yourdomain.com
├── 数据库: production-host:5432
└── Nginx: https://yourdomain.com
```

### 构建和启动命令
```bash
# 开发环境
make up-dev     # 启动完整开发环境
make db-only    # 仅启动数据库
make down       # 停止所有服务
make logs       # 查看日志
make restart    # 重启服务

# 生产环境
make up-prod    # 启动生产环境

# 数据库操作
cd backend
npx prisma studio           # 启动数据库管理界面
npx prisma migrate dev      # 运行数据库迁移
npx prisma generate         # 生成Prisma客户端
```

### 数据格式统一标准

#### 时间格式
```typescript
// 统一使用ISO 8601格式
createdAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
```

#### ID格式
```typescript
// 统一使用UUID
id: "550e8400-e29b-41d4-a716-446655440000"
```

#### 分页格式
```typescript
{
  "data": any[],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

这个架构文档提供了项目的完整技术概览，是开发团队的重要参考资料。
