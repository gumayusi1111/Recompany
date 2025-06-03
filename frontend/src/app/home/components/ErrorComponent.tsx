import Image from 'next/image'

interface ErrorComponentProps {
  error: string
  onRetry?: () => void
}

export function ErrorComponent({ error, onRetry }: ErrorComponentProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('网络') || errorMessage.includes('fetch')) {
      return {
        icon: '🌐',
        title: '网络连接异常',
        description: '请检查您的网络连接后重试'
      }
    }
    if (errorMessage.includes('超时') || errorMessage.includes('timeout')) {
      return {
        icon: '⏱️',
        title: '请求超时',
        description: '服务器响应时间过长，请稍后重试'
      }
    }
    if (errorMessage.includes('服务器') || errorMessage.includes('HTTP')) {
      return {
        icon: '🔧',
        title: '服务器异常',
        description: '服务器暂时无法响应，请稍后重试'
      }
    }
    return {
      icon: '❌',
      title: '加载失败',
      description: '页面加载遇到问题'
    }
  }

  const errorInfo = getErrorType(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/images/logo.svg"
            alt="亚豪膜结构"
            width={80}
            height={60}
            className="mx-auto opacity-50"
          />
        </div>

        {/* 错误图标 */}
        <div className="text-6xl mb-4 animate-bounce">
          {errorInfo.icon}
        </div>

        {/* 错误标题 */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {errorInfo.title}
        </h2>

        {/* 错误描述 */}
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {errorInfo.description}
        </p>

        {/* 详细错误信息 */}
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            查看详细错误信息
          </summary>
          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono">
            {error}
          </div>
        </details>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            🔄 重新加载
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            ← 返回上一页
          </button>
        </div>

        {/* 帮助信息 */}
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>如果问题持续存在，请联系技术支持</p>
          <p className="mt-1">📞 13957862987 | 📧 zhaojunxi222@gmail.com</p>
        </div>
      </div>
    </div>
  )
}
