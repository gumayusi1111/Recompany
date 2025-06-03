'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'

interface QuoteRequest {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  projectType: string
  projectDescription: string
  budget?: string
  timeline?: string
  location?: string
  status: 'new' | 'reviewing' | 'quoted' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  notes?: string
}

interface RequestStats {
  total: number
  new: number
  reviewing: number
  quoted: number
  closed: number
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [stats, setStats] = useState<RequestStats>({
    total: 0,
    new: 0,
    reviewing: 0,
    quoted: 0,
    closed: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // 获取报价请求列表
  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)
      
      const response = await fetch(`/api/quote-request?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setRequests(data.data.requests)
        setStats(data.data.stats)
      } else {
        setError(data.error || '获取数据失败')
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 更新请求状态
  const updateRequestStatus = async (id: number, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/quote-request?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchRequests() // 重新获取数据
        setShowDetails(false)
      } else {
        setError(data.error || '更新失败')
      }
    } catch (err) {
      setError('网络错误')
    }
  }

  // 删除请求
  const deleteRequest = async (id: number) => {
    if (!confirm('确定要删除这个报价请求吗？')) return
    
    try {
      const response = await fetch(`/api/quote-request?id=${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchRequests() // 重新获取数据
      } else {
        setError(data.error || '删除失败')
      }
    } catch (err) {
      setError('网络错误')
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [statusFilter, priorityFilter])

  // 过滤请求
  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.company && request.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100'
      case 'reviewing': return 'text-yellow-600 bg-yellow-100'
      case 'quoted': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // 优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // 状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />
      case 'reviewing': return <AlertCircle className="w-4 h-4" />
      case 'quoted': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          报价请求管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理来自前端的报价申请和咨询请求
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">总请求数</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">新请求</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">处理中</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.quoted}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">已报价</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">已关闭</div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索客户姓名、邮箱、项目类型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">所有状态</option>
              <option value="new">新请求</option>
              <option value="reviewing">处理中</option>
              <option value="quoted">已报价</option>
              <option value="closed">已关闭</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">所有优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 请求列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  客户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  项目信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  优先级
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {request.email}
                      </div>
                      {request.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.phone}
                        </div>
                      )}
                      {request.company && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {request.company}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.projectType}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {request.projectDescription}
                      </div>
                      {request.budget && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {request.budget}
                        </div>
                      )}
                      {request.location && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status === 'new' && '新请求'}
                      {request.status === 'reviewing' && '处理中'}
                      {request.status === 'quoted' && '已报价'}
                      {request.status === 'closed' && '已关闭'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority === 'high' && '高'}
                      {request.priority === 'medium' && '中'}
                      {request.priority === 'low' && '低'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(request.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetails(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  报价请求详情
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">客户信息</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <p><strong>姓名：</strong>{selectedRequest.name}</p>
                    <p><strong>邮箱：</strong>{selectedRequest.email}</p>
                    {selectedRequest.phone && <p><strong>电话：</strong>{selectedRequest.phone}</p>}
                    {selectedRequest.company && <p><strong>公司：</strong>{selectedRequest.company}</p>}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">项目信息</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <p><strong>项目类型：</strong>{selectedRequest.projectType}</p>
                    <p><strong>项目描述：</strong>{selectedRequest.projectDescription}</p>
                    {selectedRequest.budget && <p><strong>预算：</strong>{selectedRequest.budget}</p>}
                    {selectedRequest.timeline && <p><strong>时间要求：</strong>{selectedRequest.timeline}</p>}
                    {selectedRequest.location && <p><strong>项目地点：</strong>{selectedRequest.location}</p>}
                  </div>
                </div>
                
                {selectedRequest.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">备注</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p>{selectedRequest.notes}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">更新状态</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'reviewing')}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                    >
                      标记为处理中
                    </button>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'quoted')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
                    >
                      标记为已报价
                    </button>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'closed')}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                    >
                      关闭请求
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
