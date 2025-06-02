import { z } from 'zod';

/**
 * 首页主表验证模式
 */
export const HomepageSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * SEO区域验证模式
 */
export const HomepageSEOSchema = z.object({
  id: z.string(),
  mainTitle: z.string().optional(),
  subTitle: z.string().optional(),
  homepageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 公司介绍验证模式
 */
export const CompanyIntroSchema = z.object({
  id: z.string(),
  introText: z.string().optional(),
  imagePath: z.string().optional(),
  homepageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 轮播图验证模式
 */
export const BannerSlideSchema = z.object({
  id: z.string(),
  mainTitle: z.string().optional(),
  subTitle: z.string().optional(),
  imagePath: z.string().optional(),
  homepageId: z.string(),
  sortOrder: z.number().int().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 首页产品展示验证模式
 */
export const HomepageProductSchema = z.object({
  id: z.string(),
  homepageId: z.string(),
  productId: z.string(),
  sortOrder: z.number().int().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 首页案例展示验证模式
 */
export const HomepageCaseSchema = z.object({
  id: z.string(),
  homepageId: z.string(),
  caseId: z.string(),
  sortOrder: z.number().int().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 创建SEO区域请求验证模式
 */
export const CreateHomepageSEOSchema = z.object({
  mainTitle: z.string().min(1, 'SEO主标题不能为空').optional(),
  subTitle: z.string().optional(),
  homepageId: z.string().uuid('首页ID格式不正确'),
});

/**
 * 创建公司介绍请求验证模式
 */
export const CreateCompanyIntroSchema = z.object({
  introText: z.string().min(1, '公司介绍文本不能为空').optional(),
  imagePath: z.string().url('图片路径格式不正确').optional(),
  homepageId: z.string().uuid('首页ID格式不正确'),
});

/**
 * 创建轮播图请求验证模式
 */
export const CreateBannerSlideSchema = z.object({
  mainTitle: z.string().min(1, '轮播图主标题不能为空').optional(),
  subTitle: z.string().optional(),
  imagePath: z.string().url('图片路径格式不正确').optional(),
  homepageId: z.string().uuid('首页ID格式不正确'),
  sortOrder: z.number().int().min(0, '排序值不能为负数').default(0),
});

/**
 * 创建首页产品展示请求验证模式
 */
export const CreateHomepageProductSchema = z.object({
  homepageId: z.string().uuid('首页ID格式不正确'),
  productId: z.string().uuid('产品ID格式不正确'),
  sortOrder: z.number().int().min(0, '排序值不能为负数').default(0),
});

/**
 * 创建首页案例展示请求验证模式
 */
export const CreateHomepageCaseSchema = z.object({
  homepageId: z.string().uuid('首页ID格式不正确'),
  caseId: z.string().uuid('案例ID格式不正确'),
  sortOrder: z.number().int().min(0, '排序值不能为负数').default(0),
});

/**
 * 更新验证模式（所有字段可选）
 */
export const UpdateHomepageSEOSchema = CreateHomepageSEOSchema.partial().omit({ homepageId: true });
export const UpdateCompanyIntroSchema = CreateCompanyIntroSchema.partial().omit({ homepageId: true });
export const UpdateBannerSlideSchema = CreateBannerSlideSchema.partial().omit({ homepageId: true });
export const UpdateHomepageProductSchema = CreateHomepageProductSchema.partial().omit({ homepageId: true, productId: true });
export const UpdateHomepageCaseSchema = CreateHomepageCaseSchema.partial().omit({ homepageId: true, caseId: true });

// 导出类型
export type Homepage = z.infer<typeof HomepageSchema>;
export type HomepageSEO = z.infer<typeof HomepageSEOSchema>;
export type CompanyIntro = z.infer<typeof CompanyIntroSchema>;
export type BannerSlide = z.infer<typeof BannerSlideSchema>;
export type HomepageProduct = z.infer<typeof HomepageProductSchema>;
export type HomepageCase = z.infer<typeof HomepageCaseSchema>;

// 创建请求DTO类型
export type CreateHomepageSEODto = z.infer<typeof CreateHomepageSEOSchema>;
export type CreateCompanyIntroDto = z.infer<typeof CreateCompanyIntroSchema>;
export type CreateBannerSlideDto = z.infer<typeof CreateBannerSlideSchema>;
export type CreateHomepageProductDto = z.infer<typeof CreateHomepageProductSchema>;
export type CreateHomepageCaseDto = z.infer<typeof CreateHomepageCaseSchema>;

// 更新请求DTO类型
export type UpdateHomepageSEODto = z.infer<typeof UpdateHomepageSEOSchema>;
export type UpdateCompanyIntroDto = z.infer<typeof UpdateCompanyIntroSchema>;
export type UpdateBannerSlideDto = z.infer<typeof UpdateBannerSlideSchema>;
export type UpdateHomepageProductDto = z.infer<typeof UpdateHomepageProductSchema>;
export type UpdateHomepageCaseDto = z.infer<typeof UpdateHomepageCaseSchema>;

// 兼容旧类型定义
export type Home = Homepage;
export type HomeList = Homepage[];
export type Homes = HomeList;

// 为了兼容现有路由，添加简化的创建和更新schema
export const CreateHomeSchema = z.object({
  // 暂时为空，因为首页主表通常只需要ID和时间戳
});

export const UpdateHomeSchema = CreateHomeSchema.partial();
