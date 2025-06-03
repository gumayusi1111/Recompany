# 首页数据结构文档

## 概述

本文档详细记录了首页所有数据结构、类型定义和接口规范，为后续管理系统开发提供参考。

## 核心数据类型

### 1. 首页完整数据类型 (HomePageData)

```typescript
interface HomePageData {
  id: string                    // 页面唯一标识
  seoMainTitle: string         // SEO主标题
  seoSubTitle: string          // SEO副标题
  seoKeywords: string          // SEO关键词
  seoDescription: string       // SEO描述
  companyIntroTitle: string    // 公司介绍标题
  companyIntroText: string     // 公司介绍文本
  companyIntroImage: string    // 公司介绍图片
  bannerSlides: BannerSlide[]  // 轮播图数据
  productSectionTitle: string  // 产品区块标题
  featuredProducts: Product[]  // 特色产品列表
  caseSectionTitle: string     // 案例区块标题
  featuredCases: Case[]        // 特色案例列表
  pageConfig: PageConfig       // 页面配置
  isActive: boolean            // 是否激活
  createdAt: string           // 创建时间
  updatedAt: string           // 更新时间
}
```

### 2. 轮播图数据类型 (BannerSlide)

```typescript
interface BannerSlide {
  id: number                   // 轮播图ID
  title: string               // 标题
  subtitle: string            // 副标题
  description: string         // 描述
  imagePath: string           // 图片路径
  linkUrl?: string            // 链接地址
  linkText?: string           // 链接文本
  sortOrder: number           // 排序顺序
  isActive: boolean           // 是否激活
}
```

### 3. 产品数据类型 (Product)

```typescript
interface Product {
  id: number                   // 产品ID
  name: string                // 产品名称
  description: string         // 产品描述
  imagePath: string           // 产品图片路径
  sortOrder: number           // 排序顺序
  isActive: boolean           // 是否激活
  features?: string[]         // 产品特性
  specifications?: Record<string, string> // 产品规格
}
```

### 4. 案例数据类型 (Case)

```typescript
interface Case {
  id: number                   // 案例ID
  title: string               // 案例标题
  description: string         // 案例描述
  imagePath: string           // 案例图片路径
  client: string              // 客户名称
  location?: string           // 项目地点
  completedAt: string         // 完成时间
  sortOrder: number           // 排序顺序
  isActive: boolean           // 是否激活
  highlights?: string[]       // 案例亮点
}
```

### 5. 页面配置类型 (PageConfig)

```typescript
interface PageConfig {
  theme: 'light' | 'dark' | 'auto'  // 主题模式
  layout: 'standard' | 'compact'    // 布局模式
  showBanner: boolean               // 是否显示轮播图
  showProducts: boolean             // 是否显示产品区块
  showCases: boolean                // 是否显示案例区块
  maxProductsDisplay: number        // 最大产品显示数量
  maxCasesDisplay: number           // 最大案例显示数量
  enableAnimations: boolean         // 是否启用动画
  enableLazyLoading: boolean        // 是否启用懒加载
}
```

## API 接口规范

### 1. API响应基础类型

```typescript
interface ApiResponse<T> {
  code: number                 // 响应状态码
  msg: string                 // 响应消息
  data: T                     // 响应数据
}
```

### 2. 首页API响应类型

```typescript
type HomeApiResponse = ApiResponse<HomePageData>
```

### 3. 页面加载状态类型

```typescript
interface PageLoadingState {
  loading: boolean            // 是否正在加载
  error: string | null        // 错误信息
  data: HomePageData | null   // 页面数据
}
```

## 数据验证规则

### 1. 必填字段验证

- `seoMainTitle`: 长度1-100字符
- `seoSubTitle`: 长度1-200字符
- `seoKeywords`: 长度1-500字符
- `seoDescription`: 长度1-300字符
- `companyIntroTitle`: 长度1-100字符
- `companyIntroText`: 长度1-1000字符

### 2. 图片路径验证

- 支持格式: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
- 路径格式: `/images/[filename].[ext]`
- 文件大小: 最大2MB

### 3. 排序字段验证

- `sortOrder`: 正整数，范围1-999
- 同类型数据不允许重复排序值

## 默认数据配置

```typescript
const defaultDataConfig = {
  seoMainTitle: '欢迎来到我们的网站',
  seoSubTitle: '专业的解决方案提供商',
  seoKeywords: '解决方案,专业服务,产品,案例',
  seoDescription: '我们是一家专业的解决方案提供商，致力于为客户提供优质的产品和服务。',
  companyIntroTitle: '关于我们',
  companyIntroText: '我们是一家专业的公司，致力于为客户提供最优质的产品和服务。',
  companyIntroImage: '/images/company-intro.jpg',
  productSectionTitle: '我们的产品',
  caseSectionTitle: '成功案例'
}
```

## 错误处理机制

### 1. 数据验证错误

```typescript
class DataValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'DataValidationError'
  }
}
```

### 2. API错误

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

### 3. 错误处理函数

```typescript
function handleDataError(error: unknown): string {
  if (error instanceof Error) {
    // 网络错误
    if (error.message.includes('fetch')) {
      return '网络连接失败，请检查网络设置'
    }
    // 超时错误
    if (error.message.includes('timeout')) {
      return '请求超时，请稍后重试'
    }
    // HTTP错误
    if (error.message.includes('HTTP')) {
      return '服务器响应异常，请稍后重试'
    }
    return error.message
  }
  return '未知错误，请刷新页面重试'
}
```

## 状态管理

### 1. Zustand Store 结构

```typescript
interface HomePageStore {
  // 状态
  data: HomePageData | null
  loading: boolean
  error: string | null
  
  // 操作
  fetchData: () => Promise<void>
  updateData: (data: Partial<HomePageData>) => void
  clearError: () => void
  reset: () => void
}
```

### 2. 数据获取流程

1. 组件挂载时调用 `fetchData()`
2. 设置 `loading: true`
3. 发起API请求
4. 成功时更新 `data`，失败时设置 `error`
5. 设置 `loading: false`

## 性能优化配置

```typescript
const performanceConfig = {
  enableLazyLoading: true,      // 启用懒加载
  imageOptimization: true,      // 图片优化
  enableCaching: true,          // 启用缓存
  cacheTimeout: 5 * 60 * 1000, // 缓存超时时间(5分钟)
}
```

## 开发配置

```typescript
const devConfig = {
  enableDebugLogs: process.env.NODE_ENV === 'development',
  enableDataValidation: true,
  showDataVerification: process.env.NODE_ENV === 'development'
}
```

## 管理系统开发指南

### 1. 数据表设计建议

- `home_pages`: 首页主表
- `banner_slides`: 轮播图表
- `featured_products`: 特色产品表
- `featured_cases`: 特色案例表
- `page_configs`: 页面配置表

### 2. API端点设计

- `GET /api/home`: 获取首页数据
- `PUT /api/home`: 更新首页数据
- `POST /api/home/banner`: 添加轮播图
- `PUT /api/home/banner/:id`: 更新轮播图
- `DELETE /api/home/banner/:id`: 删除轮播图

### 3. 权限控制

- 查看权限: 所有用户
- 编辑权限: 管理员、编辑者
- 删除权限: 仅管理员

---

**文档版本**: 1.0.0  
**最后更新**: 2024-12-19  
**维护者**: AI Assistant
