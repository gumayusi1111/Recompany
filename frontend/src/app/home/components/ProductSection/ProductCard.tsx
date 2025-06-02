import { ProductCardProps } from './types'

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center relative">
        <div className="text-center text-white z-10">
          <h3 className="text-xl font-bold">{product.name}</h3>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>排序: {product.sortOrder}</span>
          <span>图片: {product.imagePath}</span>
        </div>
      </div>
    </div>
  )
}
