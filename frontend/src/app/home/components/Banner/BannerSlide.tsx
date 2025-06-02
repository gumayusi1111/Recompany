import { BannerSlideProps } from './types'

export function BannerSlide({ slide }: BannerSlideProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center relative">
        <div className="text-center text-white z-10">
          <h3 className="text-2xl font-bold mb-2">{slide.mainTitle}</h3>
          <p className="text-lg opacity-90 px-4">{slide.subTitle}</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>排序: {slide.sortOrder}</span>
          <span>图片: {slide.imagePath}</span>
        </div>
      </div>
    </div>
  )
}
