/**
 * 前端用户请求页面
 * 用户提交咨询和报价请求的表单
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  MessageSquare,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'

// 表单验证schema
const requestSchema = z.object({
  type: z.enum(['CONTACT', 'QUOTE', 'CONSULTATION'], {
    required_error: '请选择请求类型',
  }),
  name: z.string().min(1, '请输入您的姓名'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().min(1, '请输入联系电话'),
  company: z.string().optional(),
  productInterest: z.string().optional(),
  message: z.string().min(10, '请详细描述您的需求（至少10个字符）'),
})

type RequestFormData = z.infer<typeof requestSchema>

export default function RequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      type: 'CONTACT',
    },
  })

  const requestType = watch('type')

  const onSubmit = async (data: RequestFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/public/request/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        reset()
        toast.success('提交成功！我们会尽快与您联系。')
      } else {
        toast.error(result.error || '提交失败，请稍后重试')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('网络错误，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const requestTypes = [
    {
      value: 'CONTACT',
      label: '一般咨询',
      description: '了解产品信息、技术咨询等',
      icon: MessageSquare,
    },
    {
      value: 'QUOTE',
      label: '项目报价',
      description: '获取具体项目的报价方案',
      icon: Package,
    },
    {
      value: 'CONSULTATION',
      label: '技术咨询',
      description: '专业技术问题咨询和解决方案',
      icon: User,
    },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <Card.Body className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                提交成功！
              </h2>
              <p className="text-gray-600 mb-6">
                感谢您的咨询，我们已收到您的请求。<br />
                我们的专业团队会在24小时内与您联系。
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>如有紧急需求，请直接联系我们：</p>
                <p className="flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  13957862987
                </p>
                <p className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  zhaojunxi222@gmail.com
                </p>
              </div>
              <Button 
                className="mt-6"
                onClick={() => setIsSubmitted(false)}
              >
                提交新的请求
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            联系我们
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            亚豪膜结构专业团队为您提供优质的膜结构解决方案。
            请填写以下表单，我们会尽快与您联系。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 联系信息 */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">联系信息</h3>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">联系电话</p>
                    <p className="text-gray-600">13957862987</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">邮箱地址</p>
                    <p className="text-gray-600">zhaojunxi222@gmail.com</p>
                  </div>
                </div>
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
                    <p className="text-gray-600">
                      周一至周五 8:00-18:00<br />
                      周六 9:00-17:00
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* 请求表单 */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">提交请求</h3>
                <p className="text-sm text-gray-600 mt-1">
                  请详细填写您的需求，我们会为您提供专业的解决方案
                </p>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* 请求类型 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      请求类型 *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {requestTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <label
                            key={type.value}
                            className={`
                              relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors
                              ${requestType === type.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              value={type.value}
                              {...register('type')}
                              className="sr-only"
                            />
                            <Icon className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="font-medium text-sm">{type.label}</span>
                            <span className="text-xs text-gray-500 mt-1">
                              {type.description}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        姓名 *
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入您的姓名"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        联系电话 *
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入联系电话"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱地址 *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入邮箱地址"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        公司名称
                      </label>
                      <input
                        type="text"
                        {...register('company')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入公司名称（可选）"
                      />
                    </div>
                  </div>

                  {/* 产品兴趣 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      感兴趣的产品
                    </label>
                    <select
                      {...register('productInterest')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">请选择产品类型（可选）</option>
                      <option value="张拉膜结构">张拉膜结构</option>
                      <option value="骨架膜结构">骨架膜结构</option>
                      <option value="充气膜结构">充气膜结构</option>
                      <option value="ETFE膜结构">ETFE膜结构</option>
                      <option value="遮阳膜结构">遮阳膜结构</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>

                  {/* 详细需求 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      详细需求 *
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请详细描述您的项目需求、预算范围、时间要求等信息..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      我们承诺保护您的隐私信息
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          提交中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          提交请求
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
