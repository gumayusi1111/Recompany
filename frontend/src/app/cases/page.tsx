import { Metadata } from 'next'

/**
 * 工程案例页面
 * 展示公司的成功案例和项目经验
 */
export default function CasesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">工程案例</h1>
          <p className="mt-2 text-lg text-gray-600">
            展示我们在膜结构领域的专业实力和成功经验
          </p>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              工程案例页面
            </h2>
            <p className="text-gray-600 mb-6">
              此页面正在开发中，将展示我们的成功案例和项目经验。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* 示例案例卡片 */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-100 rounded-lg p-6">
                  <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">案例项目 {item}</h3>
                  <p className="text-gray-600 text-sm">
                    这里将展示具体的项目案例信息，包括项目规模、技术特点等。
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 页面元数据
export const metadata: Metadata = {
  title: '工程案例 - 亚豪膜结构',
  description: '展示亚豪膜结构在膜结构领域的专业实力和成功经验',
  keywords: '膜结构案例,工程案例,膜结构项目,亚豪膜结构'
}
