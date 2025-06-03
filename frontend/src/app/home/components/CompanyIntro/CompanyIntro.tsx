import Image from 'next/image'
import { CompanyIntroProps } from './types'
import styles from './CompanyIntro.module.css'

export function CompanyIntro({
  companyIntroTitle,
  companyIntroText,
  companyIntroImage
}: CompanyIntroProps) {
  return (
    <section className={`${styles.companySection} page-theme`}>
      <div className={styles.container}>
        {/* 区块标题 */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>亚豪膜结构</h2>
          <p className={styles.sectionSubtitle}>关于我们的品牌和愿景</p>
        </div>

        <div className={styles.content}>
          {/* 左侧文字内容 - 60% */}
          <div className={styles.textContent}>
            <div className={styles.textBlock}>
              <p className={styles.description}>
                亚豪膜结构成立于1994年，三十年来始终专注于膜结构设计与施工。致力于为客户提供安全、美观、耐火的空间解决方案。我们运用技术创新与工程品质并重，深耕大型市政、交通、体育等高端领域，力求成为行业信赖的高质量服务标杆。
              </p>
              <div className={styles.learnMore}>
                <span className={styles.learnMoreText}>了解更多</span>
                <span className={styles.arrow}>→</span>
              </div>
            </div>
          </div>

          {/* 右侧图片内容 - 40% */}
          <div className={styles.imageContent}>
            <div className={styles.imageWrapper}>
              <Image
                src={companyIntroImage || '/images/company-intro.svg'}
                alt="亚豪膜结构公司介绍"
                width={600}
                height={400}
                className={styles.image}
                priority={false}
                style={{
                  // 防止CLS：预设尺寸，与CSS保持一致
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <h3 className={styles.overlayTitle}>只做结构好产品</h3>
                  <p className={styles.overlaySubtitle}>不敷衍每一滴水珠</p>
                  <p className={styles.overlayDescription}>我们专注每一座膜结构的生命力</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
