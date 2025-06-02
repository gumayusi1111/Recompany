import { BaseComponentProps } from '../../types'

/**
 * Hero区域组件Props
 */
export interface HeroSectionProps extends BaseComponentProps {
  seoMainTitle: string
  seoSubTitle: string
  seoKeywords?: string
  seoDescription?: string
}

/**
 * Hero动画配置（组件特有类型）
 */
export interface HeroAnimationConfig {
  fadeInDuration: number
  slideDirection: 'left' | 'right' | 'up' | 'down'
  parallaxEffect: boolean
}
