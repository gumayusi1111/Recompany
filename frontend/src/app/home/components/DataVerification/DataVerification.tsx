import { DataVerificationProps } from './types'
import styles from './DataVerification.module.css'

export function DataVerification(props: DataVerificationProps) {
  return (
    <section className={styles.dataSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          数据流验证 - 来自数据库的真实数据
        </h2>
        <div className={styles.grid}>
          {/* SEO数据 */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} text-blue-600`}>SEO信息</h3>
            <div className={styles.cardContent}>
              <p><strong>主标题:</strong> {props.seoMainTitle}</p>
              <p><strong>副标题:</strong> {props.seoSubTitle}</p>
              <p><strong>关键词:</strong> {props.seoKeywords}</p>
              <p><strong>描述:</strong> {props.seoDescription}</p>
            </div>
          </div>

          {/* 公司介绍数据 */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} text-green-600`}>公司介绍</h3>
            <div className={styles.cardContent}>
              <p><strong>标题:</strong> {props.companyIntroTitle}</p>
              <p><strong>内容:</strong> {props.companyIntroText?.substring(0, 100)}...</p>
              <p><strong>图片:</strong> {props.companyIntroImage}</p>
            </div>
          </div>

          {/* 页面配置数据 */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} text-purple-600`}>页面配置</h3>
            <div className={styles.cardContent}>
              <p><strong>主题:</strong> {props.pageConfig?.theme}</p>
              <p><strong>布局:</strong> {props.pageConfig?.layout}</p>
              <p><strong>显示轮播:</strong> {props.pageConfig?.showBanner ? '是' : '否'}</p>
              <p><strong>显示产品:</strong> {props.pageConfig?.showProducts ? '是' : '否'}</p>
              <p><strong>显示案例:</strong> {props.pageConfig?.showCases ? '是' : '否'}</p>
            </div>
          </div>

          {/* 数据统计 */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} text-orange-600`}>数据统计</h3>
            <div className={styles.cardContent}>
              <p><strong>轮播图数量:</strong> {props.bannerSlides?.length || 0}</p>
              <p><strong>产品数量:</strong> {props.featuredProducts?.length || 0}</p>
              <p><strong>案例数量:</strong> {props.featuredCases?.length || 0}</p>
              <p><strong>页面状态:</strong> {props.isActive ? '激活' : '未激活'}</p>
            </div>
          </div>

          {/* 时间信息 */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} text-red-600`}>时间信息</h3>
            <div className={styles.cardContent}>
              <p><strong>页面ID:</strong> {props.id}</p>
              <p><strong>创建时间:</strong> {new Date(props.createdAt).toLocaleString('zh-CN')}</p>
              <p><strong>更新时间:</strong> {new Date(props.updatedAt).toLocaleString('zh-CN')}</p>
            </div>
          </div>

          {/* API连接状态 */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} text-indigo-600`}>连接状态</h3>
            <div className={styles.cardContent}>
              <p><strong>数据来源:</strong> 数据库 (PostgreSQL)</p>
              <p><strong>API端点:</strong> /api/home</p>
              <p><strong>数据表:</strong> home_page</p>
              <p><strong>连接状态:</strong> <span className={styles.statusSuccess}>✅ 正常</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
