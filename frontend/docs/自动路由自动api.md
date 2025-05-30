# Next.js 自动路由和自动API系统

## 目录

1. [系统概述](#系统概述)
2. [自动路由机制](#自动路由机制)
3. [自动API机制](#自动API机制)
4. [实现方法](#实现方法)
5. [使用指南](#使用指南)
6. [维护指南](#维护指南)
7. [AI辅助维护指南](#AI辅助维护指南)

## 系统概述

本项目基于Next.js 15.3.3构建，充分利用Next.js的App Router功能实现了自动路由和自动API系统。这种架构使开发更加高效，代码组织更加清晰，同时降低了维护成本。

### 核心优势

- **约定优于配置**：通过文件系统路由自动生成API端点和页面路由
- **类型安全**：TypeScript类型定义贯穿前后端
- **代码复用**：API客户端和类型定义共享
- **易于扩展**：添加新资源只需创建对应的目录和文件

## 自动路由机制

### 基本原理

Next.js的App Router基于文件系统路由，目录结构直接映射到URL路径。

```
src/app/                 → 根路由 (/)
├── about/              → /about
├── products/           → /products
│   ├── [id]/           → /products/:id (动态路由)
├── projects/           → /projects
│   ├── [id]/           → /projects/:id (动态路由)
```

### 关键文件

- **page.tsx**：渲染页面的组件
- **layout.tsx**：定义页面布局
- **loading.tsx**：加载状态组件
- **error.tsx**：错误处理组件
- **not-found.tsx**：404页面组件

## 自动API机制

### 基本原理

Next.js的App Router同样支持API路由，通过在`src/app/api`目录下创建`route.ts`文件来定义API端点。

```
src/app/api/
├── products/           → /api/products
│   ├── route.ts        → 处理产品列表的API逻辑
│   ├── [id]/           → /api/products/:id
│       ├── route.ts    → 处理单个产品的API逻辑
```

### 标准API结构

每个资源（产品、项目等）都遵循RESTful API设计原则，支持以下标准操作：

- **GET /**：获取资源列表
- **GET /:id**：获取单个资源
- **POST /**：创建新资源
- **PUT /:id**：更新资源
- **DELETE /:id**：删除资源

## 实现方法

### 1. 前端API客户端

我们在`src/lib/api.ts`中实现了统一的API客户端，为每种资源类型提供了标准化的API函数：

```typescript
// 产品相关API
export const productsAPI = {
  getAll: () => fetchAPI<Product[]>('/products'),
  getById: (id: string) => fetchAPI<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    fetchAPI<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>) => 
    fetchAPI<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    fetchAPI<{success: boolean}>(`/products/${id}`, { method: 'DELETE' }),
};
```

### 2. 类型定义

在`src/lib/types.ts`中定义了所有资源的TypeScript接口，确保前后端类型一致：

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  imageUrl?: string;
  features?: string[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

### 3. API路由实现

每个API路由文件(`route.ts`)实现了对应HTTP方法的处理函数：

```typescript
export async function GET(request: NextRequest) {
  // 获取列表或单个资源的逻辑
  return NextResponse.json({ data: [...] });
}

export async function POST(request: NextRequest) {
  // 创建资源的逻辑
  const body = await request.json();
  return NextResponse.json({ data: {...} });
}
```

## 使用指南

### 获取资源列表

```typescript
import { api } from '@/lib/api';

// 获取所有产品
const products = await api.products.getAll();

// 获取所有项目
const projects = await api.projects.getAll();
```

### 获取单个资源

```typescript
// 获取指定ID的产品
const product = await api.products.getById('product-123');
```

### 创建新资源

```typescript
// 创建新产品
const newProduct = await api.products.create({
  name: '新产品',
  description: '产品描述',
  price: 99.99
});
```

### 更新资源

```typescript
// 更新产品
const updatedProduct = await api.products.update('product-123', {
  price: 89.99
});
```

### 删除资源

```typescript
// 删除产品
const result = await api.products.delete('product-123');
```

## 维护指南

### 添加新资源类型

1. **添加类型定义**：在`src/lib/types.ts`中定义新资源的接口

```typescript
export interface NewResource {
  id: string;
  name: string;
  // 其他属性
  createdAt: string;
  updatedAt: string;
}
```

2. **创建API路由**：
   - 创建目录：`src/app/api/new-resources/`
   - 创建列表路由：`src/app/api/new-resources/route.ts`
   - 创建单项路由：`src/app/api/new-resources/[id]/route.ts`

3. **添加API客户端**：在`src/lib/api.ts`中添加新资源的API函数

```typescript
export const newResourcesAPI = {
  getAll: () => fetchAPI<NewResource[]>('/new-resources'),
  getById: (id: string) => fetchAPI<NewResource>(`/new-resources/${id}`),
  create: (data: Omit<NewResource, 'id' | 'createdAt' | 'updatedAt'>) => 
    fetchAPI<NewResource>('/new-resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<NewResource>) => 
    fetchAPI<NewResource>(`/new-resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    fetchAPI<{success: boolean}>(`/new-resources/${id}`, { method: 'DELETE' }),
};

// 更新统一导出
const api = {
  // 现有资源
  products: productsAPI,
  projects: projectsAPI,
  // 新资源
  newResources: newResourcesAPI
};
```

4. **创建页面路由**（可选）：
   - 创建目录：`src/app/new-resources/`
   - 创建列表页：`src/app/new-resources/page.tsx`
   - 创建详情页：`src/app/new-resources/[id]/page.tsx`

### 修改现有资源

1. **更新类型定义**：在`src/lib/types.ts`中修改资源接口
2. **更新API实现**：修改对应的`route.ts`文件
3. **更新前端组件**：确保UI组件适配新的数据结构

## AI辅助维护指南

本项目的自动路由和自动API系统设计使AI辅助开发和维护变得简单高效。以下是针对AI（如Cascade）的维护指南。

### 理解系统架构

AI在处理代码时应注意以下关键点：

1. **文件系统即API结构**：
   - `src/app/api/`目录下的文件结构直接映射到API端点
   - 动态段落用`[参数名]`表示（如`[id]`）

2. **类型系统**：
   - 所有数据模型都在`src/lib/types.ts`中定义
   - API客户端函数在`src/lib/api.ts`中定义
   - 两者必须保持同步

3. **一致性模式**：
   - 所有资源API遵循相同的CRUD模式
   - 响应格式保持一致（成功/错误结构）

### AI维护任务指南

1. **添加新API端点**：
   ```
   创建目录结构：src/app/api/新资源/
   添加route.ts文件实现标准HTTP方法
   更新类型定义和API客户端
   ```

2. **修改API逻辑**：
   ```
   找到对应route.ts文件
   修改HTTP方法处理函数
   确保保持错误处理和响应格式一致
   ```

3. **调试API**：
   ```
   使用fetchAPI函数的日志输出
   检查请求URL和方法是否正确
   验证数据格式是否符合类型定义
   ```

### AI协作最佳实践

1. **保持类型一致性**：修改任何数据模型时，同时更新：
   - 类型定义（`types.ts`）
   - API客户端（`api.ts`）
   - API路由实现（`route.ts`）
   - 前端组件和页面

2. **遵循约定**：
   - 文件和目录命名使用kebab-case（如`new-resources`）
   - API函数命名使用camelCase（如`getById`）
   - 类型和接口使用PascalCase（如`NewResource`）

3. **注释和文档**：
   - 为复杂逻辑添加注释
   - 更新此文档以反映系统变化

通过遵循这些指南，AI可以有效地协助维护和扩展本系统，确保代码质量和一致性。