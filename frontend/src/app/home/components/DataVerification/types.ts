import { HomePageData, BaseComponentProps } from '../../types'

/**
 * 数据验证组件Props
 * 直接继承HomePageData，避免重复定义
 */
export interface DataVerificationProps extends BaseComponentProps, HomePageData {
  // 如果需要额外的props，在这里添加
}
