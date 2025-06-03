'use client'

import styles from './MainTitle.module.css'

interface MainTitleProps {
  title: string
  subtitle: string
  description: string
}

/**
 * 首页主标题区块组件
 * 位于Banner下方，提供页面主要标题和描述
 */
export function MainTitle({ title, subtitle, description }: MainTitleProps) {
  return (
    <section className={`${styles.mainTitle} page-theme`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </section>
  )
}
