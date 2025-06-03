/**
 * 关于管理页面
 * 管理公司介绍和历史信息
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Building, History, Users, Award, Target } from 'lucide-react'

export default function AboutManagePage() {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState([])

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      setTimeout(() => {
        setSections([])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch sections:', error)
      setLoading(false)
    }
  }

  const sectionTypes = [
    {
      type: 'intro',
      title: '公司简介',
      description: '公司基本介绍和概况',
      icon: Building,
      color: 'blue'
    },
    {
      type: 'history',
      title: '发展历程',
      description: '公司发展历史和重要节点',
      icon: History,
      color: 'green'
    },
    {
      type: 'culture',
      title: '企业文化',
      description: '企业价值观和文化理念',
      icon: Target,
      color: 'purple'
    },
    {
      type: 'team',
      title: '团队介绍',
      description: '核心团队和管理层介绍',
      icon: Users,
      color: 'orange'
    },
    {
      type: 'honor',
      title: '荣誉资质',
      description: '获得的荣誉和资质证书',
      icon: Award,
      color: 'yellow'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="关于管理"
          description="管理公司介绍和历史信息"
        />
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <div className="h-32 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="关于管理"
        description="管理公司介绍、历史和团队信息"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加章节
          </Button>
        }
      />

      {/* 章节类型概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionTypes.map((section) => {
          const Icon = section.icon
          const hasContent = false // TODO: 根据实际数据判断
          
          return (
            <Card key={section.type}>
              <Card.Body>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`
                      p-3 rounded-lg mr-4
                      ${section.color === 'blue' ? 'bg-blue-100' : ''}
                      ${section.color === 'green' ? 'bg-green-100' : ''}
                      ${section.color === 'purple' ? 'bg-purple-100' : ''}
                      ${section.color === 'orange' ? 'bg-orange-100' : ''}
                      ${section.color === 'yellow' ? 'bg-yellow-100' : ''}
                    `}>
                      <Icon className={`
                        w-6 h-6
                        ${section.color === 'blue' ? 'text-blue-600' : ''}
                        ${section.color === 'green' ? 'text-green-600' : ''}
                        ${section.color === 'purple' ? 'text-purple-600' : ''}
                        ${section.color === 'orange' ? 'text-orange-600' : ''}
                        ${section.color === 'yellow' ? 'text-yellow-600' : ''}
                      `} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {section.description}
                      </p>
                      <Badge variant={hasContent ? 'success' : 'secondary'}>
                        {hasContent ? '已设置' : '未设置'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )
        })}
      </div>

      {/* 公司基本信息 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">公司基本信息</h3>
              <p className="text-sm text-gray-600 mt-1">公司的基础信息和数据</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">1994</div>
              <div className="text-sm text-gray-600">成立年份</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">30+</div>
              <div className="text-sm text-gray-600">年行业经验</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">完成项目</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">团队成员</div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 企业优势 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">企业优势</h3>
              <p className="text-sm text-gray-600 mt-1">公司的核心竞争优势</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">专业技术团队</h4>
                  <p className="text-sm text-gray-600">拥有资深的膜结构设计和施工团队</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">丰富项目经验</h4>
                  <p className="text-sm text-gray-600">30年行业经验，500+成功项目案例</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">优质材料供应</h4>
                  <p className="text-sm text-gray-600">与国际知名材料供应商长期合作</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-orange-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">完善服务体系</h4>
                  <p className="text-sm text-gray-600">从设计到施工再到维护的全流程服务</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-yellow-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">质量保证体系</h4>
                  <p className="text-sm text-gray-600">严格的质量控制和完善的售后保障</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-red-600 font-bold text-sm">6</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">创新设计理念</h4>
                  <p className="text-sm text-gray-600">结合美学与功能的创新设计方案</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
