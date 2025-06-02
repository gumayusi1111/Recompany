import { CompanyIntroProps } from './types'
import styles from './CompanyIntro.module.css'

export function CompanyIntro({ companyIntroTitle, companyIntroText }: CompanyIntroProps) {
  return (
    <section className={styles.companySection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {companyIntroTitle}
          </h2>
          <p className={styles.text}>
            {companyIntroText}
          </p>
        </div>
      </div>
    </section>
  )
}
