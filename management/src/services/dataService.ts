/**
 * 数据服务层
 * 封装所有API调用，提供统一的数据访问接口
 */

import { apiClient } from '@/lib/api/client'
import { ADMIN_API, PaginationParams } from '@/config/api'
import { Product, Case, Material, Testimonial, News } from '@/stores/dataStore'

// 基础服务类
abstract class BaseService<T> {
  protected abstract endpoints: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
    bulk?: string
  }

  async getList(params?: PaginationParams) {
    return apiClient.getPaginated<T>(this.endpoints.list, params)
  }

  async getById(id: string) {
    return apiClient.get<T>(`${this.endpoints.list}/${id}`)
  }

  async create(data: Partial<T>) {
    return apiClient.post<T>(this.endpoints.create, data)
  }

  async update(id: string, data: Partial<T>) {
    return apiClient.put<T>(this.endpoints.update(id), data)
  }

  async delete(id: string) {
    return apiClient.delete(this.endpoints.delete(id))
  }

  async bulkDelete(ids: string[]) {
    if (!this.endpoints.bulk) {
      throw new Error('Bulk operations not supported')
    }
    return apiClient.post(this.endpoints.bulk, { action: 'delete', ids })
  }

  async bulkUpdate(ids: string[], data: Partial<T>) {
    if (!this.endpoints.bulk) {
      throw new Error('Bulk operations not supported')
    }
    return apiClient.post(this.endpoints.bulk, { action: 'update', ids, data })
  }
}

// 产品服务
class ProductService extends BaseService<Product> {
  protected endpoints = {
    list: ADMIN_API.PRODUCTS.LIST,
    create: ADMIN_API.PRODUCTS.CREATE,
    update: ADMIN_API.PRODUCTS.UPDATE,
    delete: ADMIN_API.PRODUCTS.DELETE,
    bulk: ADMIN_API.PRODUCTS.BULK
  }

  async getCategories() {
    return apiClient.get<string[]>(ADMIN_API.PRODUCTS.CATEGORIES)
  }

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>) {
    return apiClient.post(this.endpoints.bulk!, { action: 'sort', items })
  }
}

// 案例服务
class CaseService extends BaseService<Case> {
  protected endpoints = {
    list: ADMIN_API.CASES.LIST,
    create: ADMIN_API.CASES.CREATE,
    update: ADMIN_API.CASES.UPDATE,
    delete: ADMIN_API.CASES.DELETE,
    bulk: ADMIN_API.CASES.BULK
  }

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>) {
    return apiClient.post(this.endpoints.bulk!, { action: 'sort', items })
  }
}

// 材料服务
class MaterialService extends BaseService<Material> {
  protected endpoints = {
    list: ADMIN_API.MATERIALS.LIST,
    create: ADMIN_API.MATERIALS.CREATE,
    update: ADMIN_API.MATERIALS.UPDATE,
    delete: ADMIN_API.MATERIALS.DELETE,
    bulk: ADMIN_API.MATERIALS.BULK
  }

  async getCategories() {
    return apiClient.get<string[]>(ADMIN_API.MATERIALS.CATEGORIES)
  }

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>) {
    return apiClient.post(this.endpoints.bulk!, { action: 'sort', items })
  }
}

// 评价服务
class TestimonialService extends BaseService<Testimonial> {
  protected endpoints = {
    list: ADMIN_API.REVIEWS.LIST,
    create: ADMIN_API.REVIEWS.CREATE,
    update: ADMIN_API.REVIEWS.UPDATE,
    delete: ADMIN_API.REVIEWS.DELETE,
    bulk: ADMIN_API.REVIEWS.BULK
  }

  async approve(id: string) {
    return apiClient.post(ADMIN_API.REVIEWS.APPROVE(id))
  }

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>) {
    return apiClient.post(this.endpoints.bulk!, { action: 'sort', items })
  }
}

// 新闻服务
class NewsService extends BaseService<News> {
  protected endpoints = {
    list: ADMIN_API.NEWS.LIST,
    create: ADMIN_API.NEWS.CREATE,
    update: ADMIN_API.NEWS.UPDATE,
    delete: ADMIN_API.NEWS.DELETE,
    bulk: ADMIN_API.NEWS.BULK
  }

  async publish(id: string) {
    return apiClient.post(ADMIN_API.NEWS.PUBLISH(id))
  }

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>) {
    return apiClient.post(this.endpoints.bulk!, { action: 'sort', items })
  }
}

// 仪表盘服务
class DashboardService {
  async getStats() {
    return apiClient.get(ADMIN_API.DASHBOARD.STATS)
  }

  async getRecentActivities() {
    return apiClient.get(ADMIN_API.DASHBOARD.RECENT_ACTIVITIES)
  }

  async getSystemInfo() {
    return apiClient.get(ADMIN_API.DASHBOARD.SYSTEM_INFO)
  }
}

// 首页管理服务
class HomeService {
  async getHeroSlides() {
    return apiClient.get(ADMIN_API.HOME.HERO_SLIDES)
  }

  async updateHeroSlides(slides: any[]) {
    return apiClient.put(ADMIN_API.HOME.HERO_SLIDES, { slides })
  }

  async getSeoTitle() {
    return apiClient.get(ADMIN_API.HOME.SEO_TITLE)
  }

  async updateSeoTitle(data: any) {
    return apiClient.put(ADMIN_API.HOME.SEO_TITLE, data)
  }

  async getCompanyIntro() {
    return apiClient.get(ADMIN_API.HOME.COMPANY_INTRO)
  }

  async updateCompanyIntro(data: any) {
    return apiClient.put(ADMIN_API.HOME.COMPANY_INTRO, data)
  }

  async getConfig() {
    return apiClient.get(ADMIN_API.HOME.CONFIG)
  }

  async updateConfig(data: any) {
    return apiClient.put(ADMIN_API.HOME.CONFIG, data)
  }
}

// 联系信息服务
class ContactService {
  async getInfo() {
    return apiClient.get(ADMIN_API.CONTACT.INFO)
  }

  async updateInfo(data: any) {
    return apiClient.put(ADMIN_API.CONTACT.UPDATE, data)
  }

  async getLocations() {
    return apiClient.get(ADMIN_API.CONTACT.LOCATIONS)
  }

  async updateLocations(locations: any[]) {
    return apiClient.put(ADMIN_API.CONTACT.LOCATIONS, { locations })
  }
}

// 关于我们服务
class AboutService {
  async getSections() {
    return apiClient.get(ADMIN_API.ABOUT.SECTIONS)
  }

  async updateSections(sections: any[]) {
    return apiClient.put(ADMIN_API.ABOUT.UPDATE, { sections })
  }

  async getHistory() {
    return apiClient.get(ADMIN_API.ABOUT.HISTORY)
  }

  async updateHistory(history: any[]) {
    return apiClient.put(ADMIN_API.ABOUT.HISTORY, { history })
  }

  async getTeam() {
    return apiClient.get(ADMIN_API.ABOUT.TEAM)
  }

  async updateTeam(team: any[]) {
    return apiClient.put(ADMIN_API.ABOUT.TEAM, { team })
  }
}

// 用户请求服务
class RequestService {
  async getList(params?: PaginationParams) {
    return apiClient.getPaginated(ADMIN_API.REQUESTS.LIST, params)
  }

  async update(id: string, data: any) {
    return apiClient.put(ADMIN_API.REQUESTS.UPDATE(id), data)
  }

  async delete(id: string) {
    return apiClient.delete(ADMIN_API.REQUESTS.DELETE(id))
  }

  async assign(id: string, assigneeId: string) {
    return apiClient.post(ADMIN_API.REQUESTS.ASSIGN(id), { assigneeId })
  }

  async reply(id: string, message: string) {
    return apiClient.post(ADMIN_API.REQUESTS.REPLY(id), { message })
  }

  async bulkUpdate(ids: string[], data: any) {
    return apiClient.post(ADMIN_API.REQUESTS.BULK, { action: 'update', ids, data })
  }
}

// 文件上传服务
class UploadService {
  async uploadImage(file: File, onProgress?: (progress: number) => void) {
    return apiClient.upload(ADMIN_API.UPLOAD.IMAGE, file, onProgress)
  }

  async uploadFile(file: File, onProgress?: (progress: number) => void) {
    return apiClient.upload(ADMIN_API.UPLOAD.FILE, file, onProgress)
  }

  async bulkUpload(files: File[], onProgress?: (progress: number) => void) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    // 这里需要特殊处理，因为是多文件上传
    return apiClient.post(ADMIN_API.UPLOAD.BULK, formData)
  }
}

// 导出服务实例
export const productService = new ProductService()
export const caseService = new CaseService()
export const materialService = new MaterialService()
export const testimonialService = new TestimonialService()
export const newsService = new NewsService()
export const dashboardService = new DashboardService()
export const homeService = new HomeService()
export const contactService = new ContactService()
export const aboutService = new AboutService()
export const requestService = new RequestService()
export const uploadService = new UploadService()

// 默认导出所有服务
export default {
  product: productService,
  case: caseService,
  material: materialService,
  testimonial: testimonialService,
  news: newsService,
  dashboard: dashboardService,
  home: homeService,
  contact: contactService,
  about: aboutService,
  request: requestService,
  upload: uploadService
}
