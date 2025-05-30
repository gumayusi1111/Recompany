import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * SEO组件，用于优化页面元数据
 * 可在每个页面中使用，提供标题、描述、关键词等信息
 */
export default function Seo({
  title = '专业建筑工程公司 - 高质量、值得信赖的建筑服务',
  description = '我们是一家专业的建筑工程公司，提供高质量的建筑服务，包括设计、施工、装修等。多年经验，值得信赖。',
  keywords = '建筑工程,工程公司,建筑服务,工程设计,建筑施工,建筑装修',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: SeoProps) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://company-re.com';
  const canonicalUrl = `${siteUrl}${router.asPath}`;
  const fullTitle = `${title} | 公司名称`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      
      {/* 移动设备支持 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* 爬虫指令 */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
}
