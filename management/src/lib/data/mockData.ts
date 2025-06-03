/**
 * 模拟数据存储
 * 亚豪膜结构公司业务数据
 */

import { Product, Case, Material, News, Testimonial, Contact, SystemSettings } from '@/lib/api/types'

// 产品数据
export let products: Product[] = [
  {
    id: 1,
    title: '张拉膜结构系统',
    content: '采用高强度PTFE膜材的张拉膜结构，适用于体育场馆、展览中心等大跨度建筑。具有自洁性强、透光性好、使用寿命长等特点。',
    category: '张拉膜',
    price: 280000,
    images: ['/images/products/tensile-1.jpg', '/images/products/tensile-2.jpg'],
    specifications: {
      材质: 'PTFE膜材',
      厚度: '0.8mm',
      跨度: '80米',
      使用寿命: '25年以上',
      透光率: '13%',
      自洁性: '优秀'
    },
    status: 'published',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    createdBy: 1
  },
  {
    id: 2,
    title: '充气膜建筑系统',
    content: '节能环保的充气膜建筑解决方案，适用于体育馆、仓储、临时建筑等。具有建设周期短、成本低、节能效果显著等优势。',
    category: '充气膜',
    price: 120000,
    images: ['/images/products/pneumatic-1.jpg'],
    specifications: {
      材质: 'PVC膜材',
      厚度: '0.9mm',
      建筑面积: '2000平方米',
      内部气压: '250Pa',
      保温性能: 'R值3.5',
      建设周期: '30天'
    },
    status: 'published',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    createdBy: 1
  },
  {
    id: 3,
    title: '索膜结构遮阳系统',
    content: '轻质高强的索膜结构遮阳解决方案，广泛应用于广场、停车场、景观建筑等。造型优美，功能实用。',
    category: '索膜结构',
    price: 85000,
    images: ['/images/products/cable-membrane-1.jpg'],
    specifications: {
      材质: 'PVC膜材',
      钢索规格: 'Φ16-32mm',
      遮阳面积: '500平方米',
      抗风等级: '12级',
      UV防护: '99%',
      颜色选择: '多种可选'
    },
    status: 'published',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    createdBy: 1
  }
]

// 案例数据
export let cases: Case[] = [
  {
    id: 1,
    title: '宁波奥体中心膜结构工程',
    content: '宁波奥体中心主体育场屋盖采用张拉膜结构，总面积达到35000平方米，是浙江省最大的膜结构工程之一。',
    client: '宁波市政府',
    location: '浙江省宁波市',
    completedAt: '2023-09-15T00:00:00Z',
    images: ['/images/cases/ningbo-stadium-1.jpg', '/images/cases/ningbo-stadium-2.jpg'],
    tags: ['体育建筑', '大跨度', '张拉膜', '地标建筑'],
    status: 'published',
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-01-10T09:30:00Z',
    createdBy: 1
  },
  {
    id: 2,
    title: '杭州西湖文化广场遮阳膜',
    content: '杭州西湖文化广场景观遮阳膜工程，采用索膜结构设计，与周边环境完美融合，成为城市新地标。',
    client: '杭州文旅集团',
    location: '浙江省杭州市',
    completedAt: '2023-06-20T00:00:00Z',
    images: ['/images/cases/hangzhou-plaza-1.jpg'],
    tags: ['景观建筑', '索膜结构', '文化建筑', '城市地标'],
    status: 'published',
    createdAt: '2023-07-01T10:15:00Z',
    updatedAt: '2023-12-15T14:20:00Z',
    createdBy: 1
  },
  {
    id: 3,
    title: '上海浦东机场T3航站楼膜结构',
    content: '上海浦东国际机场T3航站楼候机大厅膜结构工程，采用ETFE膜材，具有优异的透光性和自洁性能。',
    client: '上海机场集团',
    location: '上海市浦东新区',
    completedAt: '2023-12-10T00:00:00Z',
    images: ['/images/cases/shanghai-airport-1.jpg', '/images/cases/shanghai-airport-2.jpg'],
    tags: ['交通建筑', 'ETFE膜', '大型工程', '国际项目'],
    status: 'published',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-20T11:45:00Z',
    createdBy: 1
  }
]

// 材料数据
export let materials: Material[] = [
  {
    id: 1,
    title: 'PTFE建筑膜材',
    content: '高性能PTFE建筑膜材，具有优异的耐候性、自洁性和透光性，是高端膜结构建筑的首选材料。',
    category: '膜材',
    specifications: {
      材质: 'PTFE涂层玻璃纤维',
      厚度: '0.6-1.0mm',
      拉伸强度: '4000N/5cm',
      撕裂强度: '400N',
      透光率: '6-18%',
      使用寿命: '25年以上',
      阻燃等级: 'B1级'
    },
    supplier: '德国海德鲁公司',
    price: 180,
    status: 'published',
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    createdBy: 1
  },
  {
    id: 2,
    title: 'PVC建筑膜材',
    content: '经济实用的PVC建筑膜材，适用于中小型膜结构工程，具有良好的加工性能和性价比。',
    category: '膜材',
    specifications: {
      材质: 'PVC涂层聚酯纤维',
      厚度: '0.7-1.2mm',
      拉伸强度: '2800N/5cm',
      撕裂强度: '280N',
      透光率: '8-25%',
      使用寿命: '15年',
      阻燃等级: 'B1级'
    },
    supplier: '法国法拉利公司',
    price: 85,
    status: 'published',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    createdBy: 1
  },
  {
    id: 3,
    title: '高强度钢索系统',
    content: '专用于膜结构工程的高强度钢索系统，包括主索、边索及相关连接件，确保结构安全可靠。',
    category: '钢索',
    specifications: {
      材质: '镀锌钢丝绳',
      规格: 'Φ12-50mm',
      抗拉强度: '1770MPa',
      安全系数: '3.0',
      表面处理: '热镀锌',
      连接方式: '压制接头',
      检测标准: 'GB/T 20067'
    },
    supplier: '江苏法尔胜集团',
    price: 25,
    status: 'published',
    createdAt: '2024-01-06T13:45:00Z',
    updatedAt: '2024-01-14T16:20:00Z',
    createdBy: 1
  }
]

// 新闻数据
export let news: News[] = [
  {
    id: 1,
    title: '亚豪膜结构荣获2024年度建筑创新奖',
    content: '近日，亚豪膜结构凭借在宁波奥体中心膜结构工程中的卓越表现，荣获2024年度中国建筑创新奖。该项目采用了先进的张拉膜技术，实现了大跨度无柱空间，为观众提供了极佳的视觉体验。',
    summary: '亚豪膜结构荣获2024年度中国建筑创新奖，彰显公司在膜结构领域的技术实力。',
    author: '张明',
    publishedAt: '2024-01-20T09:00:00Z',
    tags: ['公司新闻', '获奖', '技术创新'],
    featuredImage: '/images/news/award-2024.jpg',
    status: 'published',
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    createdBy: 1
  },
  {
    id: 2,
    title: '新型ETFE膜材技术应用研讨会成功举办',
    content: '1月15日，亚豪膜结构主办的"新型ETFE膜材技术应用研讨会"在宁波成功举办。来自全国各地的建筑师、工程师和行业专家共同探讨了ETFE膜材在现代建筑中的创新应用。',
    summary: '亚豪膜结构主办ETFE膜材技术研讨会，推动行业技术交流与发展。',
    author: '李华',
    publishedAt: '2024-01-16T14:30:00Z',
    tags: ['行业动态', '技术交流', 'ETFE膜材'],
    featuredImage: '/images/news/seminar-2024.jpg',
    status: 'published',
    createdAt: '2024-01-16T13:45:00Z',
    updatedAt: '2024-01-16T15:00:00Z',
    createdBy: 1
  }
]

// 客户评价数据
export let testimonials: Testimonial[] = [
  {
    id: 1,
    clientName: '王建国',
    clientCompany: '宁波市建设局',
    content: '亚豪膜结构在宁波奥体中心项目中表现出色，从设计到施工都体现了专业水准。膜结构的质量和美观度都超出了我们的预期，是值得信赖的合作伙伴。',
    rating: 5,
    projectId: 1,
    isPublished: true,
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z'
  },
  {
    id: 2,
    clientName: '陈丽萍',
    clientCompany: '杭州文旅集团',
    content: '西湖文化广场的遮阳膜工程效果非常好，不仅功能实用，而且与周边环境协调统一。亚豪团队的服务态度和专业能力都让人印象深刻。',
    rating: 5,
    projectId: 2,
    isPublished: true,
    createdAt: '2023-07-20T14:15:00Z',
    updatedAt: '2023-07-20T14:15:00Z'
  },
  {
    id: 3,
    clientName: '张伟',
    clientCompany: '上海机场集团',
    content: '浦东机场T3航站楼膜结构工程技术难度很高，亚豪膜结构凭借丰富的经验和先进的技术，圆满完成了项目。工程质量优秀，进度控制到位。',
    rating: 5,
    projectId: 3,
    isPublished: true,
    createdAt: '2024-01-10T09:45:00Z',
    updatedAt: '2024-01-10T09:45:00Z'
  }
]

// 联系信息数据
export let contacts: Contact[] = [
  {
    id: 1,
    name: '刘先生',
    email: 'liu@example.com',
    phone: '13800138001',
    company: '某建筑设计院',
    subject: '体育馆膜结构咨询',
    message: '我们正在设计一个体育馆项目，需要了解张拉膜结构的技术方案和报价，请联系我们。',
    status: 'new',
    createdAt: '2024-01-22T09:30:00Z',
    updatedAt: '2024-01-22T09:30:00Z'
  },
  {
    id: 2,
    name: '王女士',
    email: 'wang@company.com',
    phone: '13900139002',
    company: '某地产公司',
    subject: '商业广场遮阳膜项目',
    message: '我们有一个商业广场项目，需要设计遮阳膜结构，希望能够预约实地考察和方案讨论。',
    status: 'replied',
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-01-21T10:15:00Z'
  }
]

// 系统设置数据
export let systemSettings: SystemSettings = {
  siteName: '亚豪膜结构',
  siteDescription: '专业的膜结构工程解决方案提供商，成立于1994年，专注于张拉膜、充气膜、索膜结构等领域。',
  contactEmail: 'zhaojunxi222@gmail.com',
  contactPhone: '13957862987',
  address: '宁波市海曙区镇明路108号',
  socialLinks: {
    wechat: 'yahao_membrane',
    weibo: '@亚豪膜结构',
    linkedin: 'yahao-membrane-structure'
  },
  seoSettings: {
    keywords: ['膜结构', '张拉膜', '充气膜', '索膜结构', '建筑膜材', '宁波膜结构'],
    description: '亚豪膜结构 - 专业膜结构工程公司，提供张拉膜、充气膜、索膜结构设计施工服务，30年行业经验，值得信赖。'
  }
}
