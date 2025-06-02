/**
 * 首页服务层实现
 * 使用Prisma连接数据库，基于页面化数据库设计
 */

import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * 获取首页数据
 * 返回当前激活的首页配置
 */
export const getHomePage = async () => {
  try {
    // 获取激活的首页数据
    let homePage = await prisma.homePage.findFirst({
      where: { isActive: true }
    });

    // 如果没有激活的首页数据，创建默认数据
    if (!homePage) {
      homePage = await createDefaultHomePage();
    }

    return homePage;
  } catch (error) {
    console.error('Error in getHomePage:', error);
    throw new Error('获取首页数据失败');
  }
};

/**
 * 根据ID获取首页数据
 */
export const getHomePageById = async (id: string) => {
  try {
    const homePage = await prisma.homePage.findUnique({
      where: { id }
    });
    return homePage;
  } catch (error) {
    console.error('Error in getHomePageById:', error);
    throw new Error('获取首页数据失败');
  }
};

/**
 * 更新首页数据
 */
export const updateHomePage = async (id: string, data: Prisma.HomePageUpdateInput) => {
  try {
    const updatedHomePage = await prisma.homePage.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return updatedHomePage;
  } catch (error) {
    console.error('Error in updateHomePage:', error);
    throw new Error('更新首页数据失败');
  }
};

/**
 * 创建默认首页数据
 */
export const createDefaultHomePage = async () => {
  try {
    const defaultHomePage = await prisma.homePage.create({
      data: {
        seoMainTitle: '欢迎来到我们的网站',
        seoSubTitle: '专业的解决方案提供商',
        seoKeywords: '企业官网,解决方案,专业服务',
        seoDescription: '我们是一家专业的解决方案提供商，致力于为客户提供优质的产品和服务。',

        companyIntroTitle: '关于我们',
        companyIntroText: '我们是一家专注于创新的公司，致力于为客户提供最优质的产品和服务。通过不断的技术创新和服务优化，我们已经成为行业内的领先企业。',
        companyIntroImage: '/images/company-intro.jpg',

        bannerSlides: [
          {
            id: 1,
            mainTitle: '创新引领未来',
            subTitle: '专业的技术团队，为您提供最优质的解决方案',
            imagePath: '/images/banner-1.jpg',
            sortOrder: 1
          },
          {
            id: 2,
            mainTitle: '品质成就梦想',
            subTitle: '严格的质量控制，确保每一个产品都达到最高标准',
            imagePath: '/images/banner-2.jpg',
            sortOrder: 2
          }
        ],

        productSectionTitle: '我们的产品',
        featuredProducts: [
          {
            id: 1,
            name: '产品A',
            description: '这是我们的核心产品，具有优异的性能和可靠性。',
            imagePath: '/images/product-1.jpg',
            sortOrder: 1
          },
          {
            id: 2,
            name: '产品B',
            description: '创新设计的产品，满足客户的多样化需求。',
            imagePath: '/images/product-2.jpg',
            sortOrder: 2
          }
        ],

        caseSectionTitle: '成功案例',
        featuredCases: [
          {
            id: 1,
            name: '案例A',
            description: '成功为客户提供了完整的解决方案，获得了客户的高度认可。',
            imagePath: '/images/case-1.jpg',
            clientName: '客户A',
            sortOrder: 1
          },
          {
            id: 2,
            name: '案例B',
            description: '通过技术创新，帮助客户提升了业务效率。',
            imagePath: '/images/case-2.jpg',
            clientName: '客户B',
            sortOrder: 2
          }
        ],

        pageConfig: {
          theme: 'default',
          layout: 'standard',
          showBanner: true,
          showProducts: true,
          showCases: true
        },

        isActive: true
      }
    });

    return defaultHomePage;
  } catch (error) {
    console.error('Error in createDefaultHomePage:', error);
    throw new Error('创建默认首页数据失败');
  }
};

/**
 * 更新首页SEO信息
 */
export const updateHomePageSEO = async (id: string, seoData: {
  seoMainTitle?: string;
  seoSubTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}) => {
  try {
    return await updateHomePage(id, seoData);
  } catch (error) {
    console.error('Error in updateHomePageSEO:', error);
    throw new Error('更新SEO信息失败');
  }
};

/**
 * 更新公司介绍信息
 */
export const updateCompanyIntro = async (id: string, introData: {
  companyIntroTitle?: string;
  companyIntroText?: string;
  companyIntroImage?: string;
}) => {
  try {
    return await updateHomePage(id, introData);
  } catch (error) {
    console.error('Error in updateCompanyIntro:', error);
    throw new Error('更新公司介绍失败');
  }
};

/**
 * 更新轮播图
 */
export const updateBannerSlides = async (id: string, bannerSlides: any[]) => {
  try {
    return await updateHomePage(id, { bannerSlides });
  } catch (error) {
    console.error('Error in updateBannerSlides:', error);
    throw new Error('更新轮播图失败');
  }
};

/**
 * 更新产品展示
 */
export const updateFeaturedProducts = async (id: string, featuredProducts: any[]) => {
  try {
    return await updateHomePage(id, { featuredProducts });
  } catch (error) {
    console.error('Error in updateFeaturedProducts:', error);
    throw new Error('更新产品展示失败');
  }
};

/**
 * 更新案例展示
 */
export const updateFeaturedCases = async (id: string, featuredCases: any[]) => {
  try {
    return await updateHomePage(id, { featuredCases });
  } catch (error) {
    console.error('Error in updateFeaturedCases:', error);
    throw new Error('更新案例展示失败');
  }
};

// 为了保持向后兼容，保留原有的函数名
export const getAllHome = getHomePage;
export const getHomeById = getHomePageById;
export const createHome = createDefaultHomePage;
export const updateHome = updateHomePage;
export const deleteHome = async (id: string) => {
  try {
    await prisma.homePage.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error in deleteHome:', error);
    return false;
  }
};
