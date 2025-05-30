/**
 * 类型定义文件
 * 前后端共用的数据类型定义
 */

// 基础响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 错误响应类型
export interface ApiError extends Error {
  status: number;
  info: Record<string, unknown>;
}

// 产品类型定义
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

// 项目类型定义
export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  location?: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in-progress' | 'completed';
  images?: string[];
  highlights?: string[];
  createdAt: string;
  updatedAt: string;
}

// 材料类型定义
export interface Material {
  id: string;
  name: string;
  description: string;
  type: string;
  specifications?: Record<string, string>;
  imageUrl?: string;
  supplier?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

// 见证/推荐类型定义
export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  position?: string;
  content: string;
  rating?: number;
  imageUrl?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

// 新闻类型定义
export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  imageUrl?: string;
  tags?: string[];
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}
