import { HeroSectionProps } from './types'
import styles from './HeroSection.module.css'

export function HeroSection({ seoMainTitle, seoSubTitle }: HeroSectionProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {seoMainTitle}
        </h1>
        <p className={styles.subtitle}>
          {seoSubTitle} ✨
        </p>
      </div>
    </section>
  )
}
