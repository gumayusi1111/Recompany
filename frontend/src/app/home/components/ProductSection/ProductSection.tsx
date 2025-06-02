import { ProductSectionProps } from './types'
import { ProductCard } from './ProductCard'
import styles from './ProductSection.module.css'

export function ProductSection({ products, config, sectionTitle = '我们的产品' }: ProductSectionProps) {
  // 如果配置不显示产品或没有产品数据，则不渲染
  if (!config?.showProducts || !products || products.length === 0) {
    return null
  }

  return (
    <section className={styles.productSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {sectionTitle}
        </h2>
        <div className={styles.grid}>
          {products
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  )
}
