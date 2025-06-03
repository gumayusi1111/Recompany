/**
 * 根路径页面 - 通过Next.js重定向到/home
 * 这个文件主要用于处理重定向逻辑，实际内容在/home路由中
 */

export default function RootPage() {
  // 这个页面不应该被渲染，因为Next.js会自动重定向到/home
  // 如果用户看到这个页面，说明重定向配置有问题
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">正在重定向到首页...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          如果页面没有自动跳转，请点击
          <a href="/home" className="text-blue-600 hover:text-blue-800 underline ml-1">
            这里
          </a>
        </p>
      </div>
    </div>
  )
}
