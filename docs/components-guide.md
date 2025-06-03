# 全局组件使用指南

## 📖 目录
1. [Header组件](#header组件)
2. [Footer组件](#footer组件)
3. [组件集成](#组件集成)
4. [自定义配置](#自定义配置)
5. [最佳实践](#最佳实践)

---

## 🎯 Header组件

### **组件概述**
Header组件是企业级响应式导航头部组件，支持桌面端和移动端自适应，包含公司品牌信息和导航菜单。

### **核心特性**
- ✅ 响应式设计（桌面端/移动端）
- ✅ 公司品牌展示（Logo + 公司信息）
- ✅ 导航菜单（支持外部链接）
- ✅ 移动端汉堡菜单
- ✅ 当前页面高亮
- ✅ 固定定位和滚动效果
- ✅ 主题切换功能（白天/夜晚模式）
- ✅ 防止文字换行优化
- ✅ SEO优化（结构化数据）
- ✅ 无障碍设计支持

### **基础使用**
```typescript
import { Header } from '@/components'

export default function Layout() {
  return (
    <div>
      <Header />
      {/* 页面内容 */}
    </div>
  )
}
```

### **自定义配置**
```typescript
import { Header } from '@/components'

const customCompanyInfo = {
  name: '亚豪膜结构',
  slogan: '30年专业经验 · 膜结构领域专家',
  logo: {
    src: '/images/logo.png',
    alt: '亚豪膜结构Logo',
    width: 50,
    height: 50
  }
}

const customNavigation = [
  { id: 'home', label: '首页', href: '/' },
  { id: 'about', label: '关于我们', href: '/about' },
  { id: 'products', label: '产品中心', href: '/products' },
  { id: 'external', label: '外部链接', href: 'https://example.com', isExternal: true }
]

export default function CustomHeader() {
  return (
    <Header
      companyInfo={customCompanyInfo}
      navigationItems={customNavigation}
      isFixed={true}
      isTransparent={false}
    />
  )
}
```

### **Props接口**
```typescript
interface HeaderProps {
  companyInfo?: CompanyInfo          // 公司信息
  navigationItems?: NavigationItem[] // 导航菜单项
  currentPath?: string              // 当前页面路径
  showMobileMenu?: boolean          // 是否显示移动端菜单
  onMobileMenuToggle?: () => void   // 移动端菜单切换回调
  className?: string                // 自定义CSS类名
  isFixed?: boolean                 // 是否固定在顶部
  isTransparent?: boolean           // 是否透明背景
}
```

### **样式自定义**
```css
/* 自定义Header样式 */
.customHeader {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
}

.customHeader .companyName {
  color: white;
}

.customHeader .navigationLink {
  color: rgba(255, 255, 255, 0.9);
}

.customHeader .navigationLink:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
```

---

## 🦶 Footer组件

### **组件概述**
Footer组件是企业级四列布局页脚组件，包含公司介绍、联系信息、快速链接和服务支持等内容。

### **核心特性**
- ✅ 四列响应式布局
- ✅ 公司介绍和历史
- ✅ 完整联系信息
- ✅ 快速导航链接
- ✅ 服务支持链接
- ✅ 社交媒体链接（可选）
- ✅ 版权和备案信息
- ✅ SEO优化（结构化数据）

### **基础使用**
```typescript
import { Footer } from '@/components'

export default function Layout() {
  return (
    <div>
      {/* 页面内容 */}
      <Footer />
    </div>
  )
}
```

### **自定义配置**
```typescript
import { Footer } from '@/components'

const customCompanyAbout = {
  title: '关于我们',
  description: '亚豪膜结构成立于1994年，拥有30年专业经验，专注于膜结构设计与施工。',
  establishedYear: 1994,
  experience: '30年专业经验'
}

const customContactInfo = {
  phone: '13957862987',
  email: 'zhaojunxi222@gmail.com',
  address: '宁波市海曙区镇明路108号',
  workingHours: '周一至周六 8:00-18:00'
}

const customSocialLinks = [
  {
    id: 'wechat',
    name: '微信',
    url: '#',
    icon: '💬',
    ariaLabel: '关注我们的微信'
  },
  {
    id: 'weibo',
    name: '微博',
    url: '#',
    icon: '📱',
    ariaLabel: '关注我们的微博'
  }
]

export default function CustomFooter() {
  return (
    <Footer
      companyAbout={customCompanyAbout}
      contactInfo={customContactInfo}
      socialLinks={customSocialLinks}
      showSocialLinks={true}
      showICP={true}
      copyright="© 2024 亚豪膜结构. 保留所有权利."
      icp="浙ICP备xxxxxxxx号"
    />
  )
}
```

### **Props接口**
```typescript
interface FooterProps {
  companyAbout?: CompanyAbout     // 公司关于信息
  contactInfo?: ContactInfo      // 联系信息
  quickLinks?: QuickLink[]       // 快速链接列表
  serviceLinks?: ServiceLink[]   // 服务支持链接列表
  socialLinks?: SocialLink[]     // 社交媒体链接
  copyright?: string             // 版权信息
  icp?: string                   // 备案信息
  className?: string             // 自定义CSS类名
  showSocialLinks?: boolean      // 是否显示社交媒体链接
  showICP?: boolean              // 是否显示备案信息
}
```

---

## 🔗 组件集成

### **在根布局中使用**
```typescript
// app/layout.tsx
import { Header, Footer } from '@/components'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

### **页面级自定义**
```typescript
// app/special-page/layout.tsx
import { Header, Footer } from '@/components'

export default function SpecialPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header 
        isFixed={true}
        isTransparent={true}
        className="special-header"
      />
      <main className="pt-20">
        {children}
      </main>
      <Footer 
        showSocialLinks={true}
        className="special-footer"
      />
    </>
  )
}
```

---

## ⚙️ 自定义配置

### **全局配置集成**
组件已集成到全局配置系统中，可以通过修改 `src/config/global.ts` 来统一管理：

```typescript
// config/global.ts
export const globalConfig = {
  env: {
    company: {
      name: '亚豪膜结构',
      slogan: '30年专业经验 · 膜结构领域专家',
      establishedYear: 1994,
      description: '专业的膜结构解决方案提供商'
    },
    contact: {
      phone: '13957862987',
      email: 'zhaojunxi222@gmail.com',
      address: '宁波市海曙区镇明路108号',
      workingHours: '周一至周六 8:00-18:00'
    }
  }
}
```

### **环境变量配置**
```bash
# .env.local
NEXT_PUBLIC_SITE_NAME="亚豪膜结构"
NEXT_PUBLIC_PHONE="13957862987"
NEXT_PUBLIC_EMAIL="zhaojunxi222@gmail.com"
NEXT_PUBLIC_ADDRESS="宁波市海曙区镇明路108号"
```

---

## 🎯 最佳实践

### **性能优化**
1. **图片优化**
   ```typescript
   // 使用Next.js Image组件
   import Image from 'next/image'
   
   const logo = {
     src: '/images/logo.png',
     alt: '公司Logo',
     width: 50,
     height: 50
   }
   ```

2. **懒加载**
   ```typescript
   // 对于非关键组件使用懒加载
   const HeavyFooterComponent = lazy(() => import('./HeavyFooterComponent'))
   ```

### **SEO优化**
1. **结构化数据**
   - Header和Footer组件已内置结构化数据
   - 自动生成Organization schema

2. **语义化HTML**
   - 使用正确的HTML5语义标签
   - 提供完整的aria-label

### **无障碍设计**
1. **键盘导航**
   ```typescript
   // 确保所有交互元素可通过键盘访问
   <button
     aria-label="打开菜单"
     aria-expanded={isMenuOpen}
     onKeyDown={handleKeyDown}
   >
   ```

2. **屏幕阅读器支持**
   ```typescript
   // 提供清晰的aria标签
   <nav role="navigation" aria-label="主导航">
   ```

### **响应式设计**
1. **断点管理**
   ```css
   /* 使用统一的断点 */
   @media (max-width: 768px) {
     .navigation { display: none; }
     .mobileMenuButton { display: flex; }
   }
   ```

2. **移动端优化**
   ```typescript
   // 移动端菜单状态管理
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   
   // 阻止背景滚动
   useEffect(() => {
     if (isMobileMenuOpen) {
       document.body.style.overflow = 'hidden'
     } else {
       document.body.style.overflow = ''
     }
   }, [isMobileMenuOpen])
   ```

### **维护指南**
1. **定期更新**
   - 检查联系信息的准确性
   - 更新导航链接
   - 验证外部链接的有效性

2. **监控和分析**
   - 使用性能监控工具
   - 分析用户交互数据
   - 优化导航体验

3. **版本管理**
   - 记录组件变更
   - 保持向后兼容
   - 提供迁移指南
