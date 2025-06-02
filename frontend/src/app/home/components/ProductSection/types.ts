import { Product, ConfigurableComponentProps } from '../../types'

/**
 * 产品展示区域组件Props
 */
export interface ProductSectionProps extends ConfigurableComponentProps {
  products: Product[]
  sectionTitle?: string
}

/**
 * 产品卡片组件Props
 */
export interface ProductCardProps {
  product: Product
}

/**
 * 产品筛选配置（组件特有类型）
 */
export interface ProductFilterConfig {
  categories: string[]
  sortOptions: ('name' | 'price' | 'date')[]
  showSearch: boolean
}
