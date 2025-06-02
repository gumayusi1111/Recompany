import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: '关于我们', href: '/about' },
      { name: '企业文化', href: '/about#culture' },
      { name: '发展历程', href: '/about#history' },
      { name: '联系我们', href: '/contact' },
    ],
    products: [
      { name: '产品中心', href: '/products' },
      { name: '解决方案', href: '/products#solutions' },
      { name: '技术支持', href: '/products#support' },
      { name: '下载中心', href: '/products#downloads' },
    ],
    services: [
      { name: '工程案例', href: '/cases' },
      { name: '客户好评', href: '/reviews' },
      { name: '售后服务', href: '/contact#service' },
      { name: '常见问题', href: '/contact#faq' },
    ],
    news: [
      { name: '新闻动态', href: '/news' },
      { name: '行业资讯', href: '/news#industry' },
      { name: '材料科普', href: '/materials' },
      { name: '技术文章', href: '/news#tech' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div>
            <h3 className="text-xl font-bold mb-4">企业官网</h3>
            <p className="text-gray-400 mb-4">
              专业的解决方案提供商，致力于为客户提供优质的产品和服务。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">微信</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.5 12.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">微博</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 公司链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">公司</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 产品链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">产品</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 服务链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">服务</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} 企业官网. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  )
}
