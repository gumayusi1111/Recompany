/**
 * 首页管理页面
 * 管理轮播图、SEO标题、公司介绍等首页内容
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default function HomeManagePage() {
  const [loading, setLoading] = useState(true)
  const [heroSlides, setHeroSlides] = useState([])
  const [seoTitle, setSeoTitle] = useState(null)
  const [companyIntro, setCompanyIntro] = useState(null)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      // const response = await fetch('/api/admin/home')
      // const data = await response.json()
      
      // 模拟数据
      setTimeout(() => {
        setHeroSlides([])
        setSeoTitle(null)
        setCompanyIntro(null)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch home data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="首页管理"
          description="管理网站首页的轮播图、SEO设置和公司介绍"
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
        title="首页管理"
        description="管理网站首页的轮播图、SEO设置和公司介绍"
      />

      {/* 轮播图管理 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">轮播图管理</h3>
              <p className="text-sm text-gray-600 mt-1">管理首页轮播图片和内容</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加轮播图
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-12 text-gray-500">
            暂无轮播图数据
            <br />
            <Button variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              创建第一个轮播图
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* SEO标题管理 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">SEO标题设置</h3>
              <p className="text-sm text-gray-600 mt-1">设置首页的主标题和副标题</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-12 text-gray-500">
            暂未设置SEO标题
            <br />
            <Button variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              设置SEO标题
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* 公司介绍管理 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">公司介绍</h3>
              <p className="text-sm text-gray-600 mt-1">管理首页的公司介绍内容</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-12 text-gray-500">
            暂未设置公司介绍
            <br />
            <Button variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              添加公司介绍
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* 首页配置 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">首页配置</h3>
              <p className="text-sm text-gray-600 mt-1">配置首页的产品和案例预览设置</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              配置
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">产品预览</h4>
              <p className="text-sm text-gray-600 mb-4">首页显示的推荐产品数量和标题</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>显示数量:</span>
                  <span>6个</span>
                </div>
                <div className="flex justify-between">
                  <span>标题:</span>
                  <span>产品中心</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">案例预览</h4>
              <p className="text-sm text-gray-600 mb-4">首页显示的推荐案例数量和标题</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>显示数量:</span>
                  <span>6个</span>
                </div>
                <div className="flex justify-between">
                  <span>标题:</span>
                  <span>工程案例</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
