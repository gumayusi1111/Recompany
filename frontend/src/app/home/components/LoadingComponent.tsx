import Image from 'next/image'
import { uiTextConfig } from '../config'

export function LoadingComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* 品牌Logo动画 */}
        <div className="relative mb-8">
          <div className="animate-pulse-slow">
            <Image
              src="/images/logo.svg"
              alt="亚豪膜结构"
              width={120}
              height={90}
              className="mx-auto filter drop-shadow-lg"
              priority
            />
          </div>

          {/* 环形加载动画 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-blue-500 border-r-blue-300"
              style={{
                animationDuration: '2s',
                animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
              }}
            ></div>
          </div>
        </div>

        {/* 加载文字 */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            亚豪膜结构
          </h2>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">
            {uiTextConfig.loading}
          </p>
        </div>

        {/* 进度指示器 */}
        <div className="mt-6 w-48 mx-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-loading-bar"
              style={{
                animation: 'loading-bar 2s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
