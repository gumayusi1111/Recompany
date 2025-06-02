
# 📘 Prisma 完整技术文档与使用指南

## 📖 目录
1. [Prisma基础知识](#prisma基础知识)
2. [项目架构与数据流](#项目架构与数据流)
3. [Zod验证系统](#zod验证系统)
4. [数据库连接架构](#数据库连接架构)
5. [开发流程标准化](#开发流程标准化)
6. [Prisma命令速查表](#prisma命令速查表)
7. [测试和维护](#测试和维护)
8. [常见问题解答](#常见问题解答)

---

## 🎯 Prisma基础知识

### 什么是Prisma？

**Prisma** 是一个现代化的数据库工具包，它是传统ORM的进化版本。与传统SQL相比，Prisma提供了：

- **类型安全**：自动生成TypeScript类型，编译时就能发现错误
- **自动补全**：IDE中提供完整的代码提示
- **查询构建器**：用JavaScript/TypeScript语法构建复杂查询
- **迁移管理**：版本化的数据库结构变更
- **可视化工具**：Prisma Studio提供图形化数据管理

### Prisma vs 传统SQL

```sql
-- 传统SQL（容易出错，无类型检查）
SELECT u.id, u.name, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.active = true;
```

```typescript
// Prisma（类型安全，自动补全）
const usersWithPosts = await prisma.user.findMany({
  where: { active: true },
  include: { posts: true }
});
```

### Prisma的三大组件

1. **Prisma Client**: 用于查询数据库的TypeScript客户端
2. **Prisma Migrate**: 数据库迁移系统，管理数据库结构变更
3. **Prisma Studio**: 可视化数据库管理界面

## 🏗️ 项目架构与数据流

### 完整数据流向图

```
前端页面 (Next.js)
    ↓ HTTP请求
API路由 (/api/*)
    ↓ 数据验证
Zod验证模式
    ↓ 通过验证
控制器 (Controller)
    ↓ 业务逻辑
服务层 (Service)
    ↓ 数据库操作
Prisma客户端
    ↓ SQL查询
PostgreSQL数据库
```

### 在本项目中的具体架构

```
frontend/src/pages/
├── index.tsx (首页)
└── api/ (API路由)

backend/src/
├── lib/
│   └── prisma.ts (Prisma客户端服务)
├── modules/
│   ├── home/
│   │   ├── schemas/ (Zod验证模式)
│   │   ├── controllers/ (API控制器)
│   │   ├── services/ (业务逻辑)
│   │   └── types/ (TypeScript类型)
│   └── cases/
└── prisma/
    ├── schema.prisma (数据库模型定义)
    └── migrations/ (迁移文件)
```

### schema.prisma文件结构详解

```prisma
// 1. 生成器配置 - 指定生成什么类型的客户端
generator client {
  provider = "prisma-client-js"  // 生成JavaScript/TypeScript客户端
}

// 2. 数据源配置 - 指定数据库类型和连接
datasource db {
  provider = "postgresql"        // 数据库类型
  url      = env("DATABASE_URL") // 连接字符串
}

// 3. 数据模型定义
model Homepage {
  id        String   @id @default(uuid())  // 主键，自动生成UUID
  createdAt DateTime @default(now())       // 创建时间，自动设置
  updatedAt DateTime @updatedAt            // 更新时间，自动更新

  // 关联关系定义
  seoSections HomepageSEO[] @relation("HomepageToSEO")

  @@map("homepage")  // 映射到数据库表名
}
```

### Prisma语法要点

- `@id`: 主键标识
- `@default()`: 默认值
- `@map()`: 字段名映射
- `@@map()`: 表名映射
- `@relation()`: 关系定义
- `String?`: 可选字段（允许null）
- `@db.Text`: 数据库特定类型

---

## �️ Zod验证系统

### 为什么需要数据验证？

在Web应用中，**永远不要信任用户输入**。Zod验证系统提供：

1. **运行时类型检查**：确保数据符合预期格式
2. **错误信息**：提供详细的验证失败原因
3. **类型推断**：自动生成TypeScript类型
4. **API安全**：防止恶意数据注入

### 验证模式与Prisma模型的对应关系

```typescript
// Prisma模型（数据库结构）
model Homepage {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Zod验证模式（API请求验证）
export const CreateHomepageSchema = z.object({
  // 注意：不包含id、createdAt、updatedAt
  // 这些字段由数据库自动生成
});

export const HomepageSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
```

### 验证模式的使用流程

```typescript
// 1. 定义验证模式
const CreateUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('邮箱格式不正确')
});

// 2. 在API中使用
export async function POST(request: Request) {
  const body = await request.json();

  // 验证请求数据
  const validatedData = CreateUserSchema.parse(body);

  // 使用Prisma保存到数据库
  const user = await prisma.user.create({
    data: validatedData
  });

  return Response.json(user);
}
```

---

## 🔌 数据库连接架构

### 环境变量配置详解

#### 开发环境 vs 生产环境

```bash
# 开发环境 (.env)
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re

# 生产环境 (.env.production)
DATABASE_URL=postgresql://username:password@production-host:5432/company_re
```

#### 数据库连接字符串格式

```
postgresql://[用户名]:[密码]@[主机]:[端口]/[数据库名]?[参数]

示例：
postgresql://postgres:postgres@localhost:5432/company_re?schema=public
```

**参数说明：**
- `schema=public`: 指定数据库模式
- `sslmode=require`: 要求SSL连接
- `connection_limit=10`: 连接池大小

### Prisma服务文件的作用

**为什么需要 `lib/prisma.ts`？**

```typescript
// ❌ 错误做法：每次都创建新实例
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // 会创建多个连接

// ✅ 正确做法：使用单例模式
import { prisma } from '@/lib/prisma'; // 复用同一个实例
```

**`lib/prisma.ts` 的核心功能：**

1. **连接池管理**：避免创建过多数据库连接
2. **热重载兼容**：开发环境中避免连接泄漏
3. **错误处理**：统一的连接错误处理
4. **日志记录**：记录数据库查询日志
5. **健康检查**：提供连接状态检查功能

### 项目中的角色定位

```
应用启动
    ↓
lib/prisma.ts (创建客户端实例)
    ↓
各模块的服务层 (导入prisma实例)
    ↓
执行数据库操作
    ↓
返回结果给控制器
```

---

## 📋 开发流程标准化

### 从ER图到数据库的完整步骤

#### 第1步：设计ER图
```bash
# 在 frontend/docs/er图/ 目录下创建 .puml 文件
# 定义实体、属性、关系
```

#### 第2步：转换为Prisma模型
```bash
# 编辑 backend/prisma/schema.prisma
# 将ER图实体转换为Prisma model
```

#### 第3步：生成客户端
```bash
cd backend
npx prisma generate
```

#### 第4步：创建迁移
```bash
npx prisma migrate dev --name 描述性名称
```

#### 第5步：创建Zod验证模式
```bash
# 在对应模块的 schemas/ 目录下创建验证文件
```

#### 第6步：实现API接口
```bash
# 创建控制器、服务层、路由
```

### 每个新页面/功能的开发流程

```mermaid
graph TD
    A[需求分析] --> B[设计ER图]
    B --> C[更新Prisma Schema]
    C --> D[生成迁移]
    D --> E[创建Zod验证]
    E --> F[实现服务层]
    F --> G[创建API接口]
    G --> H[前端集成]
    H --> I[测试验证]
```

#### 具体步骤示例（以"产品管理"为例）

1. **ER图设计**
```puml
entity "产品" as Product {
  * 产品ID : UUID <<PK>>
  --
  产品名称 : 字符串
  产品描述 : 文本
  产品图片 : 字符串
  创建时间 : 时间戳
  更新时间 : 时间戳
}
```

2. **Prisma模型**
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?  @db.Text
  imagePath   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

3. **Zod验证模式**
```typescript
export const CreateProductSchema = z.object({
  name: z.string().min(1, '产品名称不能为空'),
  description: z.string().optional(),
  imagePath: z.string().url().optional(),
});
```

4. **服务层实现**
```typescript
export class ProductService {
  async createProduct(data: CreateProductDto) {
    return await prisma.product.create({ data });
  }
}
```

### 数据库结构变更的安全流程

#### 🟢 安全操作（自动处理）
- **添加新表**：`npx prisma migrate dev --name add_new_table`
- **添加新字段**：`npx prisma migrate dev --name add_new_field`
- **修改字段类型**（兼容）：扩大字段长度等

#### 🟡 需要注意的操作
- **重命名字段**：需要手动编写迁移SQL
- **修改字段类型**（不兼容）：可能导致数据丢失

#### 🔴 危险操作（需要备份）
- **删除字段**：会永久丢失数据
- **删除表**：会永久丢失整个表的数据

#### Prisma迁移的自动化程度

**✅ 自动处理的情况：**
```prisma
// 添加新字段（自动添加）
model User {
  id    String @id
  name  String
  email String // 新增字段，自动创建迁移
}
```

**⚠️ 需要手动处理的情况：**
```prisma
// 重命名字段（需要手动指定）
model User {
  id       String @id
  fullName String @map("name") // 重命名需要手动迁移
}
```

**❌ 危险操作示例：**
```prisma
// 删除字段（会丢失数据）
model User {
  id   String @id
  name String
  // email 字段被删除，数据会丢失
}
```

---

## 📋 Prisma命令速查表

### 🔧 1. 初始化 Prisma 项目

```bash
npx prisma init
```

**作用**：创建 Prisma 项目初始结构，包括：
- `prisma/schema.prisma`（模型定义文件）
- `.env`（环境变量配置文件）

---

### ✏️ 2. 编辑数据模型

编辑 `prisma/schema.prisma` 文件，定义 `model`，如：

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String?
  description String?
}
```

---

### 📦 3. 安装依赖（如尚未安装）

```bash
npm install prisma @prisma/client
```

---

### ⚙️ 4. 生成 Prisma Client（每次模型修改后都要执行）

```bash
npx prisma generate
```

**作用**：根据 `schema.prisma` 生成可在代码中调用的 Prisma Client（即 ORM 操作函数）。

---

### 🧱 5. 数据库迁移（推荐使用）

```bash
npx prisma migrate dev --name init
```

**适用场景**：
- 每次对 `schema.prisma` 做结构性修改时使用
- `--name` 是当前这次迁移的命名（如 `init`、`add-user-table` 等）
- 会创建 `migrations/` 目录并自动执行 `CREATE TABLE` 等 SQL 操作

---

### 🔍 6. 打开 Prisma Studio 可视化界面

```bash
npx prisma studio
```

**作用**：以网页形式浏览、编辑数据库中数据（开发阶段非常有用）。

---

### 📄 7. 查看当前数据库状态

```bash
npx prisma migrate status
```

**作用**：检查数据库是否与当前 `schema.prisma` 匹配。

---

### 📤 8. 手动推送 schema 到数据库（不创建迁移记录）

```bash
npx prisma db push
```

**适用场景**：
- 快速同步 `schema.prisma` 到数据库，但不会生成 migration 文件
- 一般用于原型开发阶段

---

### 🧪 9. 运行数据填充脚本（种子数据）

```bash
npx prisma db seed
```

需要先在 `package.json` 中添加：

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

再创建 `prisma/seed.ts`，写入数据插入逻辑。

---

### 🧠 什么时候用哪个命令？

| 场景 | 推荐命令 |
|------|----------|
| 初始化 Prisma 项目 | `npx prisma init` |
| 定义或修改模型后 | `npx prisma generate` |
| 正式结构修改建表 | `npx prisma migrate dev --name xxx` |
| 快速同步模型到数据库（不记录迁移） | `npx prisma db push` |
| 浏览数据库数据 | `npx prisma studio` |
| 插入初始数据 | `npx prisma db seed` |
| 检查数据库结构一致性 | `npx prisma migrate status` |

---

## 🧪 测试和维护

### 数据库连接测试

#### 1. 健康检查API

```typescript
// backend/src/routes/health.ts
import { checkDatabaseConnection } from '@/lib/prisma';

export async function GET() {
  const dbStatus = await checkDatabaseConnection();

  return Response.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
}
```

#### 2. 测试数据库连接

```bash
# 启动数据库
docker-compose -f docker-compose.dev.yml up -d db

# 测试连接
cd backend
npx prisma db push

# 查看数据库状态
npx prisma migrate status
```

### API接口测试

#### 1. 使用Prisma Studio

```bash
npx prisma studio
```

在浏览器中打开 `http://localhost:5555`，可以：
- 查看所有表和数据
- 手动添加、编辑、删除数据
- 测试关联关系

#### 2. 使用curl测试API

```bash
# 测试创建首页SEO
curl -X POST http://localhost:3001/api/homepage/seo \
  -H "Content-Type: application/json" \
  -d '{
    "mainTitle": "欢迎来到我们的网站",
    "subTitle": "专业的解决方案提供商",
    "homepageId": "homepage-uuid"
  }'
```

### 常见问题排查

#### 1. 数据库连接失败

```bash
# 检查数据库是否运行
docker ps | grep postgres

# 检查环境变量
echo $DATABASE_URL

# 测试连接
npx prisma db push
```

#### 2. 迁移失败

```bash
# 查看迁移状态
npx prisma migrate status

# 重置数据库（开发环境）
npx prisma migrate reset

# 手动应用迁移
npx prisma migrate deploy
```

#### 3. 类型错误

```bash
# 重新生成客户端
npx prisma generate

# 重启TypeScript服务
# 在VSCode中：Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### 数据备份和恢复策略

#### 开发环境备份

```bash
# 导出数据
docker exec -t postgres_container pg_dump -U postgres company_re > backup.sql

# 恢复数据
docker exec -i postgres_container psql -U postgres company_re < backup.sql
```

#### 生产环境备份

```bash
# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_${DATE}.sql"

# 保留最近7天的备份
find . -name "backup_*.sql" -mtime +7 -delete
```

---

## ❓ 常见问题解答

### Q1: 修改字段后是否自动同步？

**A**: 部分自动，部分需要手动处理

- ✅ **自动同步**：添加新字段、新表、扩大字段长度
- ⚠️ **需要确认**：重命名字段、修改字段类型
- ❌ **需要手动**：删除字段、复杂数据迁移

### Q2: 删除字段的处理机制？

**A**: Prisma会警告并要求确认

```bash
# 删除字段时会提示
? We need to reset the PostgreSQL database "company_re" at "localhost:5432"
Do you want to continue? All data will be lost. › (y/N)
```

**安全删除字段的步骤：**
1. 备份数据库
2. 确认字段不再使用
3. 运行迁移
4. 验证应用正常运行

### Q3: lib/prisma.ts的必要性？

**A**: 绝对必要，原因如下：

1. **避免连接泄漏**：防止创建过多数据库连接
2. **开发体验**：热重载时不会重复创建连接
3. **性能优化**：连接池管理
4. **错误处理**：统一的连接错误处理
5. **监控日志**：记录数据库操作日志

### Q4: 如何验证数据库模型正确性？

**A**: 多层验证策略

1. **Schema验证**：`npx prisma validate`
2. **迁移测试**：`npx prisma migrate dev`
3. **数据验证**：`npx prisma studio`
4. **API测试**：使用Postman或curl
5. **单元测试**：编写自动化测试

### Q5: 开发环境数据库重置？

```bash
# 完全重置（删除所有数据）
npx prisma migrate reset

# 仅应用新迁移
npx prisma migrate dev

# 强制同步（不创建迁移）
npx prisma db push --force-reset
```

---

## 🚀 快速启动指南

### 第一次设置项目

```bash
# 1. 启动数据库（使用项目的makefile）
make db-only

# 2. 安装依赖
cd backend && npm install

# 3. 生成Prisma客户端
npx prisma generate

# 4. 运行迁移
npx prisma migrate dev --name init

# 5. 查看数据库
npx prisma studio

# 6. 启动完整开发环境
cd .. && make up-dev
```

### 项目Docker配置说明

本项目使用单一的 `docker-compose.yml` 文件，通过不同的环境变量文件来区分开发和生产环境：

```bash
# 开发环境启动
make up-dev    # 等同于: docker compose --env-file env.dev up --build

# 生产环境启动
make up-prod   # 等同于: docker compose --env-file env.prod up --build -d

# 仅启动数据库（用于开发时的Prisma操作）
make db-only   # 等同于: docker compose --env-file env.dev up -d db

# 停止所有服务
make down      # 等同于: docker compose down
```

### 重要配置说明

#### 数据库连接配置

**在Docker容器外运行Prisma命令时**（如迁移、Studio）：
```bash
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re
```

**在Docker容器内运行应用时**：
```bash
# env.dev 或 env.prod
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re
```

这是因为：
- `localhost:5432` - 从宿主机访问Docker容器
- `db:5432` - 从Docker容器内部访问数据库服务

### 日常开发流程

```bash
# 1. 修改schema.prisma
# 2. 生成新迁移
npx prisma migrate dev --name 描述性名称

# 3. 更新Zod验证模式
# 4. 测试API接口
# 5. 提交代码
```

这份文档应该能够解答你的所有疑问并作为项目的长期参考。有任何问题都可以随时询问！

---

## ✏️ 2. 编辑数据模型

编辑 `prisma/schema.prisma` 文件，定义 `model`，如：

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String?
  description String?
}
```

---

## 📦 3. 安装依赖（如尚未安装）

```bash
npm install prisma @prisma/client
```

---

## ⚙️ 4. 生成 Prisma Client（每次模型修改后都要执行）

```bash
npx prisma generate
```

**作用**：根据 `schema.prisma` 生成可在代码中调用的 Prisma Client（即 ORM 操作函数）。

---

## 🧱 5. 数据库迁移（推荐使用）

```bash
npx prisma migrate dev --name init
```

**适用场景**：
- 每次对 `schema.prisma` 做结构性修改时使用
- `--name` 是当前这次迁移的命名（如 `init`、`add-user-table` 等）
- 会创建 `migrations/` 目录并自动执行 `CREATE TABLE` 等 SQL 操作

---

## 🔍 6. 打开 Prisma Studio 可视化界面

```bash
npx prisma studio
```

**作用**：以网页形式浏览、编辑数据库中数据（开发阶段非常有用）。

---

## 📄 7. 查看当前数据库状态

```bash
npx prisma migrate status
```

**作用**：检查数据库是否与当前 `schema.prisma` 匹配。

---

## 📤 8. 手动推送 schema 到数据库（不创建迁移记录）

```bash
npx prisma db push
```

**适用场景**：
- 快速同步 `schema.prisma` 到数据库，但不会生成 migration 文件
- 一般用于原型开发阶段

---

## 🧪 9. 运行数据填充脚本（种子数据）

```bash
npx prisma db seed
```

需要先在 `package.json` 中添加：

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

再创建 `prisma/seed.ts`，写入数据插入逻辑。

---

## 🧠 什么时候用哪个命令？

| 场景 | 推荐命令 |
|------|----------|
| 初始化 Prisma 项目 | `npx prisma init` |
| 定义或修改模型后 | `npx prisma generate` |
| 正式结构修改建表 | `npx prisma migrate dev --name xxx` |
| 快速同步模型到数据库（不记录迁移） | `npx prisma db push` |
| 浏览数据库数据 | `npx prisma studio` |
| 插入初始数据 | `npx prisma db seed` |
| 检查数据库结构一致性 | `npx prisma migrate status` |
