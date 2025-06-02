import { CaseCardProps } from './types'

export function CaseCard({ case: caseItem }: CaseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center relative">
        <div className="text-center text-white z-10">
          <h3 className="text-xl font-bold mb-2">{caseItem.name}</h3>
          <p className="text-sm opacity-90">客户：{caseItem.clientName}</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{caseItem.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>排序: {caseItem.sortOrder}</span>
          <span>图片: {caseItem.imagePath}</span>
        </div>
      </div>
    </div>
  )
}
