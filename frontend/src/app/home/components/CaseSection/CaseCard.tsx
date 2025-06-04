import { CaseCardProps } from './types'

export function CaseCard({ case: caseItem }: CaseCardProps) {
  return (
    <a
      href="/cases"
      className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
      title={`查看${caseItem.name}工程案例详情 - 亚豪膜结构`}
    >
      <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center relative group-hover:from-purple-500 group-hover:to-pink-600 transition-all duration-300">
        <div className="text-center text-white z-10">
          <h3 className="text-xl font-bold mb-2">{caseItem.name}</h3>
          <p className="text-sm opacity-90">客户：{caseItem.clientName}</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-5 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{caseItem.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>排序: {caseItem.sortOrder}</span>
          <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">查看详情 →</span>
        </div>
      </div>
    </a>
  )
}
