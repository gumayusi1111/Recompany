import { Case, ConfigurableComponentProps } from '../../types'

/**
 * 案例展示区域组件Props
 */
export interface CaseSectionProps extends ConfigurableComponentProps {
  cases: Case[]
  sectionTitle?: string
}

/**
 * 案例卡片组件Props
 */
export interface CaseCardProps {
  case: Case
}
