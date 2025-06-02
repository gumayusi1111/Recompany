import { CaseSectionProps } from './types'
import { CaseCard } from './CaseCard'
import styles from './CaseSection.module.css'

export function CaseSection({ cases, config, sectionTitle = '成功案例' }: CaseSectionProps) {
  // 如果配置不显示案例或没有案例数据，则不渲染
  if (!config?.showCases || !cases || cases.length === 0) {
    return null
  }

  return (
    <section className={styles.caseSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {sectionTitle}
        </h2>
        <div className={styles.grid}>
          {cases
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((caseItem) => (
              <CaseCard key={caseItem.id} case={caseItem} />
            ))}
        </div>
      </div>
    </section>
  )
}
