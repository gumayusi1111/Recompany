import { BannerSlide, ConfigurableComponentProps } from '../../types'

/**
 * 轮播图组件Props
 */
export interface BannerProps extends ConfigurableComponentProps {
  slides: BannerSlide[]
}

/**
 * 轮播图单项组件Props
 */
export interface BannerSlideProps {
  slide: BannerSlide
}

/**
 * 轮播图动画配置（组件特有类型示例）
 */
export interface BannerAnimationConfig {
  duration: number
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  autoPlay: boolean
  interval: number
}
