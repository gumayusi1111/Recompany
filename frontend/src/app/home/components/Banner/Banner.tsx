import { BannerProps } from './types'
import { BannerSlide } from './BannerSlide'
import { uiTextConfig } from '../../config'
import styles from './Banner.module.css'

export function Banner({ slides, config }: BannerProps) {
  // 如果配置不显示轮播图或没有轮播图数据，则不渲染
  if (!config?.showBanner || !slides || slides.length === 0) {
    return null
  }

  return (
    <section className={styles.bannerSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {uiTextConfig.bannerSectionTitle}
        </h2>
        <div className={styles.grid}>
          {slides
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((slide) => (
              <BannerSlide key={slide.id} slide={slide} />
            ))}
        </div>
      </div>
    </section>
  )
}
