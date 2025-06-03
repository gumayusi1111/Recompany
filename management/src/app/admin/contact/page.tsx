/**
 * 联系管理页面
 * 管理联系方式和地址信息
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react'

export default function ContactManagePage() {
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      setTimeout(() => {
        setContacts([])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="联系管理"
          description="管理公司联系方式和地址信息"
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
        title="联系管理"
        description="管理公司联系方式和地址信息"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加联系方式
          </Button>
        }
      />

      {/* 主要联系信息 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">主要联系信息</h3>
              <p className="text-sm text-gray-600 mt-1">公司主要的联系方式和地址</p>
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
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">联系电话</p>
                  <p className="text-gray-600">13957862987</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">邮箱地址</p>
                  <p className="text-gray-600">zhaojunxi222@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">公司网站</p>
                  <p className="text-gray-600">www.membrane.com</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-red-600 mr-3 mt-1" />
                <div>
                  <p className="font-medium">公司地址</p>
                  <p className="text-gray-600">宁波市海曙区镇明路108号</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-orange-600 mr-3 mt-1" />
                <div>
                  <p className="font-medium">工作时间</p>
                  <p className="text-gray-600">周一至周五 8:00-18:00</p>
                  <p className="text-gray-600">周六 9:00-17:00</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 分支机构 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">分支机构</h3>
              <p className="text-sm text-gray-600 mt-1">管理各地分支机构联系信息</p>
            </div>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              添加分支
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-12 text-gray-500">
            暂无分支机构信息
            <br />
            <Button variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              添加第一个分支机构
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* 客服信息 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">客服信息</h3>
              <p className="text-sm text-gray-600 mt-1">客户服务联系方式</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">销售热线</h4>
              <p className="text-gray-600">400-123-4567</p>
              <Badge variant="success" className="mt-2">24小时</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">技术支持</h4>
              <p className="text-gray-600">support@membrane.com</p>
              <Badge variant="secondary" className="mt-2">工作时间</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">售后服务</h4>
              <p className="text-gray-600">400-765-4321</p>
              <Badge variant="warning" className="mt-2">工作日</Badge>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 地图设置 */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">地图设置</h3>
              <p className="text-sm text-gray-600 mt-1">配置地图显示和坐标信息</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              配置地图
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">地图坐标</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>纬度:</span>
                  <span>29.8683</span>
                </div>
                <div className="flex justify-between">
                  <span>经度:</span>
                  <span>121.5440</span>
                </div>
                <div className="flex justify-between">
                  <span>缩放级别:</span>
                  <span>15</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">显示设置</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>显示标记:</span>
                  <Badge variant="success">启用</Badge>
                </div>
                <div className="flex justify-between">
                  <span>显示路线:</span>
                  <Badge variant="success">启用</Badge>
                </div>
                <div className="flex justify-between">
                  <span>地图类型:</span>
                  <span>标准地图</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
