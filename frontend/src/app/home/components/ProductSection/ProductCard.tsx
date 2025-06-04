import Link from 'next/link'
import { ProductCardProps } from './types'

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:border-blue-200/80 transition-all duration-500 hover:-translate-y-2">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* 产品图片区域 */}
      <div className="relative h-52 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
        {/* 动态背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-indigo-500/30 to-purple-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>

        {/* 产品标题 */}
        <div className="relative text-center text-white z-10 px-4">
          <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{product.name}</h3>
          <div className="w-12 h-0.5 bg-white/60 mx-auto rounded-full"></div>
        </div>

        {/* 悬浮装饰 */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
          <span className="text-white text-sm">✨</span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="relative p-6 bg-white/80 backdrop-blur-sm">
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{product.description}</p>

        {/* 产品信息 */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded-md">排序: {product.sortOrder}</span>
          <span className="text-xs truncate max-w-24" title={product.imagePath}>
            {product.imagePath ? '有图片' : '无图片'}
          </span>
        </div>

        {/* 底部操作区 */}
        <div className="flex justify-center">
          <Link
            href="/products"
            className="relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group/btn w-full text-center block"
            title={`查看${product.name}详情 - 亚豪膜结构`}
          >
            {/* 按钮光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            <span className="relative">查看详情</span>
          </Link>
        </div>
      </div>

      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
