'use client'

import Link from 'next/link'
import { 
  FooterProps, 
  FooterColumnProps, 
  ContactInfoProps, 
  LinkListProps,
  CompanyAbout,
  ContactInfo,
  QuickLink,
  ServiceLink
} from './types'
import { globalConfig } from '@/config/global'
import styles from './Footer.module.css'

/**
 * 默认公司关于信息
 */
const defaultCompanyAbout: CompanyAbout = {
  title: '关于我们',
  description: '亚豪膜结构成立于1994年，拥有30年专业经验，专注于膜结构设计与施工，提供全方位的膜结构解决方案。',
  establishedYear: 1994,
  experience: '30年专业经验'
}

/**
 * 默认联系信息
 */
const defaultContactInfo: ContactInfo = {
  phone: '13957862987',
  email: 'zhaojunxi222@gmail.com',
  address: '宁波市海曙区镇明路108号',
  workingHours: '周一至周六 8:00-18:00'
}

/**
 * 默认快速链接
 */
const defaultQuickLinks: QuickLink[] = [
  { id: 'products', label: '产品中心', href: '/products' },
  { id: 'cases', label: '工程案例', href: '/cases' },
  { id: 'materials', label: '技术文档', href: '/materials' },
  { id: 'contact', label: '联系我们', href: '/contact' }
]

/**
 * 默认服务支持链接
 */
const defaultServiceLinks: ServiceLink[] = [
  { id: 'feedback', label: '客户反馈', href: '/feedback' },
  { id: 'process', label: '施工流程', href: '/process' },
  { id: 'maintenance', label: '维护保养', href: '/maintenance' },
  { id: 'consultation', label: '在线咨询', href: '/consultation' },
  { id: 'privacy', label: '隐私政策', href: '/privacy' },
  { id: 'terms', label: '使用条款', href: '/terms' }
]

/**
 * Footer列组件
 */
function FooterColumn({ title, children, className = '' }: FooterColumnProps) {
  return (
    <div className={`${styles.column} ${className}`}>
      <h3 className={`${styles.columnTitle} footer-title`}>{title}</h3>
      {children}
    </div>
  )
}

/**
 * 联系信息组件
 */
function ContactInfoComponent({ contactInfo }: ContactInfoProps) {
  return (
    <ul className={styles.contactList}>
      <li className={styles.contactItem}>
        <span className={`${styles.contactIcon} footer-contact-icon`}>📱</span>
        <a
          href={`tel:${contactInfo.phone}`}
          className={`${styles.contactLink} footer-link`}
          aria-label={`拨打电话 ${contactInfo.phone}`}
        >
          {contactInfo.phone}
        </a>
      </li>
      <li className={styles.contactItem}>
        <span className={`${styles.contactIcon} footer-contact-icon`}>📧</span>
        <a
          href={`mailto:${contactInfo.email}`}
          className={`${styles.contactLink} footer-link`}
          aria-label={`发送邮件到 ${contactInfo.email}`}
        >
          {contactInfo.email}
        </a>
      </li>
      <li className={styles.contactItem}>
        <span className={`${styles.contactIcon} footer-contact-icon`}>📍</span>
        <span className={`${styles.contactText} footer-text`}>{contactInfo.address}</span>
      </li>
      <li className={styles.contactItem}>
        <span className={`${styles.contactIcon} footer-contact-icon`}>⏰</span>
        <span className={`${styles.contactText} footer-text`}>{contactInfo.workingHours}</span>
      </li>
    </ul>
  )
}

/**
 * 链接列表组件
 */
function LinkList({ links, isDoubleColumn = false }: LinkListProps) {
  return (
    <ul className={`${styles.linkList} ${isDoubleColumn ? styles.doubleColumn : ''}`}>
      {links.map((link) => (
        <li key={link.id} className={styles.linkItem}>
          {link.isExternal ? (
            <a
              href={link.href}
              className={`${styles.link} ${styles.external} footer-link`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (在新窗口中打开)`}
            >
              {link.label}
            </a>
          ) : (
            <Link
              href={link.href}
              className={`${styles.link} footer-link`}
              aria-label={link.label}
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * Footer组件
 * 企业级四列布局页脚组件
 */
export function Footer({
  companyAbout = defaultCompanyAbout,
  contactInfo = defaultContactInfo,
  quickLinks = defaultQuickLinks,
  serviceLinks = defaultServiceLinks,
  socialLinks = [],
  copyright,
  icp,
  className = '',
  showSocialLinks = false,
  showICP = true
}: FooterProps) {
  // 生成版权信息
  const currentYear = new Date().getFullYear()
  const copyrightText = copyright || `© ${currentYear} 亚豪膜结构. 保留所有权利.`
  
  // 生成备案信息
  const icpText = icp || '浙ICP备xxxxxxxx号'

  return (
    <footer className={`${styles.footer} footer-theme ${className}`} role="contentinfo">
      <div className={styles.container}>
        {/* 主要内容区域 */}
        <div className={styles.content}>
          {/* 第一列：关于我们 */}
          <FooterColumn title={companyAbout.title}>
            <div className={`${styles.aboutContent} aboutContent`}>
              <p>{companyAbout.description}</p>
              {companyAbout.establishedYear && companyAbout.experience && (
                <p className={styles.establishedInfo}>
                  成立于{companyAbout.establishedYear}年 · {companyAbout.experience}
                </p>
              )}
            </div>
          </FooterColumn>

          {/* 第二列：联系方式 */}
          <FooterColumn title="联系方式">
            <ContactInfoComponent contactInfo={contactInfo} />
          </FooterColumn>

          {/* 第三列：快速链接 */}
          <FooterColumn title="快速链接">
            <LinkList links={quickLinks} />
          </FooterColumn>

          {/* 第四列：服务支持 */}
          <FooterColumn title="服务支持">
            <LinkList links={serviceLinks} isDoubleColumn={true} />
            
            {/* 社交媒体链接 */}
            {showSocialLinks && socialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    title={social.name}
                  >
                    <span>{social.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </FooterColumn>
        </div>

        {/* 底部版权区域 */}
        <div className={`${styles.bottom} footer-bottom`}>
          <p className={`${styles.copyright} footer-text`}>{copyrightText}</p>
          {showICP && (
            <a
              href="https://beian.miit.gov.cn/"
              className={`${styles.icp} footer-link`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看备案信息"
            >
              {icpText}
            </a>
          )}
        </div>
      </div>

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '亚豪膜结构',
            url: globalConfig.env.siteUrl,
            foundingDate: companyAbout.establishedYear ? `${companyAbout.establishedYear}-01-01` : undefined,
            description: companyAbout.description,
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: contactInfo.phone,
              email: contactInfo.email,
              contactType: 'customer service',
              availableLanguage: 'Chinese'
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: '宁波市',
              addressRegion: '浙江省',
              addressCountry: 'CN',
              streetAddress: contactInfo.address
            }
          })
        }}
      />
    </footer>
  )
}
