/**
 * 前端API调用服务
 * 用于统一管理前后端接口调用
 */

import { ApiError, Product, Project, Material, Testimonial, News } from './types';

// 从环境变量获取API基础URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3002';

// 基础请求方法
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // 如果响应不成功，抛出错误
  if (!res.ok) {
    const error = new Error('API响应错误') as ApiError;
    error.status = res.status;
    error.info = await res.json();
    throw error;
  }

  return res.json();
}

// 产品相关API
export const productsAPI = {
  getAll: () => fetchAPI<Product[]>('/products'),
  getById: (id: string) => fetchAPI<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => fetchAPI<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>) => fetchAPI<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{success: boolean}>(`/products/${id}`, { method: 'DELETE' }),
};

// 工程案例相关API (原项目API，现已重命名为cases)
export const casesAPI = {
  getAll: () => fetchAPI<Project[]>('/cases'),
  getById: (id: string) => fetchAPI<Project>(`/cases/${id}`),
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => fetchAPI<Project>('/cases', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Project>) => fetchAPI<Project>(`/cases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{success: boolean}>(`/cases/${id}`, { method: 'DELETE' }),
};

// 保持向后兼容的别名
export const projectsAPI = casesAPI;

// 材料相关API
export const materialsAPI = {
  getAll: () => fetchAPI<Material[]>('/materials'),
  getById: (id: string) => fetchAPI<Material>(`/materials/${id}`),
  create: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => fetchAPI<Material>('/materials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Material>) => fetchAPI<Material>(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{success: boolean}>(`/materials/${id}`, { method: 'DELETE' }),
};

// 见证相关API
export const testimonialsAPI = {
  getAll: () => fetchAPI<Testimonial[]>('/testimonials'),
  getById: (id: string) => fetchAPI<Testimonial>(`/testimonials/${id}`),
  create: (data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => fetchAPI<Testimonial>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Testimonial>) => fetchAPI<Testimonial>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{success: boolean}>(`/testimonials/${id}`, { method: 'DELETE' }),
};

// 新闻相关API
export const newsAPI = {
  getAll: () => fetchAPI<News[]>('/news'),
  getById: (id: string) => fetchAPI<News>(`/news/${id}`),
  create: (data: Omit<News, 'id' | 'createdAt' | 'updatedAt'>) => fetchAPI<News>('/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<News>) => fetchAPI<News>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{success: boolean}>(`/news/${id}`, { method: 'DELETE' }),
};

// 统一导出所有API
const api = {
  products: productsAPI,
  cases: casesAPI,
  projects: projectsAPI, // 向后兼容别名
  materials: materialsAPI,
  testimonials: testimonialsAPI,
  news: newsAPI,
};

export default api;
