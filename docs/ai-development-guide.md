# 🤖 AI助手开发指南

## 📖 目录
1. [需求分析与任务转换](#需求分析与任务转换)
2. [数据库字段修改流程](#数据库字段修改流程)
3. [验证与确认机制](#验证与确认机制)
4. [可视化工具使用](#可视化工具使用)
5. [用户信息收集清单](#用户信息收集清单)

---

## 🎯 需求分析与任务转换

### 接收用户需求的标准流程

#### 第1步：需求理解与确认
```markdown
用户需求示例：
"我想在首页添加一个新闻公告模块，显示最新的3条公告"

AI分析要点：
1. 功能范围：首页新增模块
2. 数据结构：新闻公告表
3. 显示逻辑：最新3条
4. 关联关系：与首页的关联
```

#### 第2步：技术任务分解
```markdown
具体开发任务：
1. 设计ER图：新闻公告实体及其与首页的关系
2. 创建Prisma模型：News表和Homepage-News关联表
3. 创建Zod验证模式：新闻CRUD的数据验证
4. 实现API接口：新闻的增删改查
5. 前端组件开发：新闻展示组件
6. 集成测试：确保功能正常工作
```

#### 第3步：优先级排序
```markdown
开发优先级：
1. 高优先级：数据库结构设计（影响后续所有开发）
2. 中优先级：后端API实现（提供数据接口）
3. 低优先级：前端UI优化（用户体验提升）
```

### 常见需求类型及处理方式

#### 类型1：新增功能模块
**识别关键词：** "添加"、"新增"、"创建"
**处理流程：**
1. 分析数据结构需求
2. 设计数据库表
3. 创建API接口
4. 实现前端组件

#### 类型2：修改现有功能
**识别关键词：** "修改"、"更新"、"调整"
**处理流程：**
1. 分析现有实现
2. 评估修改影响范围
3. 制定迁移策略
4. 逐步实施修改

#### 类型3：删除功能
**识别关键词：** "删除"、"移除"、"取消"
**处理流程：**
1. 确认删除范围
2. 检查依赖关系
3. 制定数据清理策略
4. 执行安全删除

---

## 🗄️ 数据库字段修改流程

### 完整的字段修改流程

#### 第1步：ER图设计
```puml
@startuml
entity "新闻公告" as News {
  * 公告ID : UUID <<PK>>
  --
  标题 : 字符串
  内容 : 文本
  发布时间 : 时间戳
  状态 : 枚举(草稿/发布/下线)
  创建时间 : 时间戳
  更新时间 : 时间戳
}

entity "首页" as Homepage {
  * 首页ID : UUID <<PK>>
  --
  创建时间 : 时间戳
  更新时间 : 时间戳
}

Homepage ||--o{ News : "显示"
@enduml
```

#### 第2步：Prisma Schema转换
```prisma
// 新增新闻公告模型
model News {
  id          String   @id @default(uuid()) @map("news_id")
  title       String   @map("news_title")
  content     String?  @map("news_content") @db.Text
  publishTime DateTime @map("publish_time")
  status      NewsStatus @default(DRAFT)
  homepageId  String   @map("homepage_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // 关联关系
  homepage    Homepage @relation("HomepageToNews", fields: [homepageId], references: [id], onDelete: Cascade)
  
  @@map("news")
}

enum NewsStatus {
  DRAFT     // 草稿
  PUBLISHED // 已发布
  OFFLINE   // 已下线
}

// 更新首页模型
model Homepage {
  id        String   @id @default(uuid()) @map("homepage_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // 新增关联关系
  news      News[]   @relation("HomepageToNews")
  
  @@map("homepage")
}
```

#### 第3步：生成迁移
```bash
# 在backend目录执行
npx prisma migrate dev --name add_news_module

# 验证迁移文件
cat prisma/migrations/[timestamp]_add_news_module/migration.sql
```

#### 第4步：创建Zod验证模式
```typescript
// backend/src/modules/news/schemas/news.schema.ts
import { z } from 'zod';

export const NewsStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'OFFLINE']);

export const CreateNewsSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200字符'),
  content: z.string().optional(),
  publishTime: z.date(),
  status: NewsStatusEnum.default('DRAFT'),
  homepageId: z.string().uuid('首页ID格式不正确'),
});

export const UpdateNewsSchema = CreateNewsSchema.partial().omit({ homepageId: true });

export type CreateNewsDto = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsDto = z.infer<typeof UpdateNewsSchema>;
```

#### 第5步：验证数据库结构
```bash
# 启动Prisma Studio
cd backend && npx prisma studio

# 在浏览器中验证：
# 1. 检查news表是否创建
# 2. 检查字段类型是否正确
# 3. 检查关联关系是否建立
# 4. 测试数据插入和查询
```

---

## ✅ 验证与确认机制

### 字段添加验证清单

#### 数据库层面验证
- [ ] 表是否成功创建：`\dt` 在psql中查看
- [ ] 字段类型是否正确：`\d table_name` 查看表结构
- [ ] 索引是否创建：检查主键和外键约束
- [ ] 关联关系是否正确：测试JOIN查询

#### 应用层面验证
- [ ] Prisma客户端是否更新：`npx prisma generate`
- [ ] TypeScript类型是否生成：检查@prisma/client导出
- [ ] Zod验证是否工作：测试数据验证
- [ ] API接口是否响应：使用curl测试

### 字段删除确认机制

#### 删除前安全检查
```bash
# 1. 检查字段使用情况
grep -r "fieldName" backend/src/
grep -r "fieldName" frontend/src/

# 2. 检查数据库中是否有数据
docker compose exec db psql -U postgres -d company_re -c "SELECT COUNT(*) FROM table_name WHERE field_name IS NOT NULL;"

# 3. 备份相关数据
docker compose exec db pg_dump -U postgres -d company_re -t table_name > backup_before_delete.sql
```

#### 删除执行步骤
```bash
# 1. 修改Prisma schema（注释掉字段）
# 2. 生成迁移
npx prisma migrate dev --name remove_field_name

# 3. 确认迁移内容
cat prisma/migrations/[timestamp]_remove_field_name/migration.sql

# 4. 执行迁移（不可逆操作）
# 迁移会自动执行，数据将永久删除
```

### 字段修改验证步骤

#### 兼容性修改（安全）
- 扩大字段长度：VARCHAR(50) → VARCHAR(100)
- 添加可选字段：新增字段设置为可空
- 修改默认值：不影响现有数据

#### 不兼容修改（危险）
- 缩小字段长度：可能导致数据截断
- 修改字段类型：String → Int 可能失败
- 设置字段为必填：现有空值会导致错误

---

## 🔍 可视化工具使用

### Prisma Studio使用指南

#### 启动和访问
```bash
# 启动Prisma Studio
cd backend && npx prisma studio

# 访问地址：http://localhost:5555
```

#### 主要功能和检查点

##### 1. 数据库结构验证
- **表列表**：左侧面板显示所有表
- **字段信息**：点击表名查看字段详情
- **关联关系**：查看表之间的连接线

##### 2. 数据操作和验证
- **查看数据**：点击表名查看现有数据
- **添加数据**：点击"Add record"测试数据插入
- **编辑数据**：直接编辑字段值测试更新
- **删除数据**：测试删除操作

##### 3. 关联关系测试
- **外键约束**：测试关联数据的创建和删除
- **级联操作**：验证onDelete: Cascade是否工作
- **数据一致性**：检查关联数据的完整性

#### 常用验证场景

##### 场景1：新表创建验证
```markdown
检查清单：
1. 表是否出现在左侧列表中
2. 字段名称和类型是否正确
3. 主键是否正确设置（显示钥匙图标）
4. 外键关联是否显示连接线
5. 能否成功插入测试数据
```

##### 场景2：字段修改验证
```markdown
检查清单：
1. 字段类型是否已更新
2. 字段约束是否生效（必填/可选）
3. 默认值是否正确应用
4. 现有数据是否保持完整
5. 新数据插入是否符合新规则
```

##### 场景3：关联关系验证
```markdown
检查清单：
1. 关联表之间是否显示连接线
2. 外键字段是否正确显示
3. 能否通过关联创建数据
4. 删除父记录时子记录是否正确处理
5. 查询关联数据是否返回正确结果
```

---

## 📋 用户信息收集清单

### 开始开发前必需信息

#### 功能需求信息
- [ ] **功能描述**：用户想要实现什么功能？
- [ ] **使用场景**：在什么情况下使用这个功能？
- [ ] **用户角色**：谁会使用这个功能？
- [ ] **数据来源**：数据从哪里来？如何获取？
- [ ] **显示要求**：数据如何展示？有什么格式要求？

#### 技术实现信息
- [ ] **页面位置**：功能在哪个页面？
- [ ] **数据结构**：需要存储哪些字段？
- [ ] **关联关系**：与现有数据有什么关系？
- [ ] **权限要求**：谁可以查看/编辑这些数据？
- [ ] **性能要求**：数据量大概多少？有什么性能要求？

#### 业务逻辑信息
- [ ] **验证规则**：数据有什么验证要求？
- [ ] **业务流程**：数据的生命周期是什么？
- [ ] **异常处理**：出错时应该如何处理？
- [ ] **通知机制**：是否需要通知相关人员？

### 信息收集模板

```markdown
## 功能开发需求单

### 基本信息
- **功能名称**：[用户填写]
- **优先级**：高/中/低
- **预期完成时间**：[用户填写]

### 功能描述
- **功能概述**：[详细描述功能]
- **使用场景**：[什么时候使用]
- **用户角色**：[谁会使用]

### 数据需求
- **数据字段**：[列出所有需要的字段]
- **字段类型**：[每个字段的数据类型]
- **验证规则**：[数据验证要求]
- **关联关系**：[与现有数据的关系]

### 界面需求
- **页面位置**：[在哪个页面]
- **显示方式**：[如何展示数据]
- **交互方式**：[用户如何操作]

### 技术要求
- **性能要求**：[响应时间、数据量等]
- **兼容性要求**：[浏览器、设备等]
- **安全要求**：[权限、加密等]
```

### 常见遗漏信息及提醒

#### 经常被忽略的重要信息
1. **数据验证规则**：字段长度、格式要求、必填性
2. **错误处理**：数据异常时的处理方式
3. **权限控制**：谁可以查看、编辑、删除数据
4. **数据关联**：与现有功能的关系和影响
5. **性能考虑**：大数据量时的处理方式

#### 主动询问的问题模板
```markdown
为了更好地实现您的需求，我需要确认以下信息：

1. 数据结构方面：
   - 这个功能需要存储哪些具体信息？
   - 每个字段的数据类型和长度要求是什么？
   - 哪些字段是必填的，哪些是可选的？

2. 业务逻辑方面：
   - 数据的生命周期是什么？（创建→编辑→删除）
   - 是否需要数据审核流程？
   - 出现错误时应该如何处理？

3. 用户体验方面：
   - 数据应该如何排序和筛选？
   - 是否需要分页显示？
   - 用户操作是否需要确认提示？

4. 技术实现方面：
   - 预期的数据量大概是多少？
   - 是否需要与其他系统集成？
   - 有什么特殊的性能要求？
```

通过这个指南，AI助手可以更系统地处理用户需求，确保开发过程的完整性和准确性。

---

## 🌐 服务地址和连接信息

### 开发环境服务地址

#### 前端服务
- **访问地址**：http://localhost:3000
- **容器名称**：company_re-frontend-1
- **内部端口**：3000
- **技术栈**：Next.js 15.3.3 + React 18 + TypeScript

#### 后端API服务
- **访问地址**：http://localhost:3001
- **API基础URL**：http://localhost:3001/api
- **健康检查**：http://localhost:3001/api/health
- **容器名称**：company_re-backend-1
- **内部端口**：3001
- **技术栈**：Express.js 5.1.0 + TypeScript + Prisma

#### 数据库服务
- **主机地址**：localhost:5432 (容器外访问)
- **容器内地址**：db:5432 (容器内访问)
- **数据库名称**：company_re
- **用户名**：postgres
- **密码**：postgres
- **容器名称**：company_re-db-1
- **技术栈**：PostgreSQL 15

#### Prisma Studio
- **访问地址**：http://localhost:5555
- **启动命令**：`cd backend && npx prisma studio`
- **用途**：数据库可视化管理工具

#### Nginx反向代理
- **HTTP访问**：http://localhost:80
- **HTTPS访问**：https://localhost:443
- **容器名称**：company_re-nginx-1
- **用途**：前后端请求代理和负载均衡

### 生产环境服务地址

#### 前端服务
- **访问地址**：https://yourdomain.com
- **内部端口**：3000
- **环境变量**：NODE_ENV=production

#### 后端API服务
- **访问地址**：https://api.yourdomain.com
- **API基础URL**：https://api.yourdomain.com/api
- **健康检查**：https://api.yourdomain.com/api/health
- **内部端口**：3001
- **环境变量**：NODE_ENV=production

#### 数据库服务
- **主机地址**：production-host:5432
- **数据库名称**：company_re
- **用户名**：production_user
- **密码**：production_password
- **SSL连接**：required

### 容器内外访问差异

#### 数据库连接差异
```bash
# 容器外访问（用于Prisma命令、本地开发工具）
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re

# 容器内访问（用于应用运行时）
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re
```

#### 服务间通信
```bash
# 前端调用后端（开发环境）
API_BASE_URL=http://localhost:3001/api

# 容器内服务间调用
API_BASE_URL=http://backend:3001/api

# 生产环境
API_BASE_URL=https://api.yourdomain.com/api
```

### 环境变量配置文件

#### 开发环境配置 (env.dev)
```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re

# 服务端口
PORT=3001
FRONTEND_PORT=3000

# 环境标识
NODE_ENV=development

# API配置
API_BASE_URL=http://localhost:3001/api

# 日志级别
LOG_LEVEL=debug
```

#### 生产环境配置 (env.prod)
```bash
# 数据库配置
DATABASE_URL=postgresql://username:password@production-host:5432/company_re

# 服务端口
PORT=3001
FRONTEND_PORT=3000

# 环境标识
NODE_ENV=production

# API配置
API_BASE_URL=https://api.yourdomain.com/api

# 安全配置
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://yourdomain.com

# 日志级别
LOG_LEVEL=info
```

#### 后端Prisma专用配置 (backend/.env)
```bash
# 用于Prisma CLI命令的数据库连接
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re

# 注意：这个文件仅用于Prisma命令，不用于应用运行时
```

### 服务验证命令

#### 快速服务状态检查
```bash
# 检查所有容器状态
docker compose ps

# 测试前端服务
curl -s -o /dev/null -w "前端: %{http_code}\n" http://localhost:3000

# 测试后端服务
curl -s -o /dev/null -w "后端: %{http_code}\n" http://localhost:3001

# 测试健康检查API
curl http://localhost:3001/api/health | jq .

# 测试数据库连接
docker compose exec -T db psql -U postgres -d company_re -c "SELECT version();"

# 测试Nginx代理
curl -s -o /dev/null -w "Nginx: %{http_code}\n" http://localhost:80
```

#### 详细连接测试
```bash
# 测试容器间网络连通性
docker compose exec backend ping -c 3 db
docker compose exec frontend ping -c 3 backend

# 测试数据库连接（从后端容器）
docker compose exec backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => console.log('DB Connected')).catch(console.error);
"

# 测试API接口
curl -X GET http://localhost:3001/api/health
curl -X GET http://localhost:3001/api/home
```

### 开发工具访问

#### Prisma Studio使用
```bash
# 启动Prisma Studio
cd backend && npx prisma studio

# 访问地址：http://localhost:5555
# 功能：
# - 查看数据库表结构
# - 浏览和编辑数据
# - 测试数据关联关系
# - 验证数据库迁移结果
```

#### Swagger API文档
```bash
# 访问地址：http://localhost:3001/api-docs
# 功能：
# - 查看所有API接口文档
# - 在线测试API接口
# - 查看请求/响应格式
# - 下载API规范文件
```

### 故障排查地址

#### 服务无法访问时的检查顺序
1. **容器状态**：`docker compose ps`
2. **容器日志**：`docker compose logs [service-name]`
3. **端口占用**：`lsof -i :3001`
4. **网络连通**：`docker compose exec backend ping db`
5. **环境变量**：`docker compose exec backend env | grep DATABASE`

#### 常见问题和对应地址
- **前端404错误**：检查 http://localhost:3000
- **API接口404**：检查 http://localhost:3001/api/health
- **数据库连接失败**：检查 localhost:5432
- **Nginx代理错误**：检查 http://localhost:80

这些地址和配置信息是AI助手进行开发和问题排查的重要参考。
