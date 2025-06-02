import { BaseComponentProps } from '../../types'

/**
 * 公司介绍组件Props
 */
export interface CompanyIntroProps extends BaseComponentProps {
  companyIntroTitle: string
  companyIntroText: string
  companyIntroImage?: string
}
