/**
 * 数据表格组件
 * 统一的表格展示和分页功能
 */

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column {
  key: string
  title: string
  sortable?: boolean
  render?: (value: any, record: any, index: number) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: Pagination
  onPageChange?: (page: number) => void
  onSort?: (field: string, order: 'asc' | 'desc') => void
  emptyText?: string
  emptyDescription?: string
  className?: string
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  emptyText = '暂无数据',
  emptyDescription,
  className,
}) => {
  const handleSort = (column: Column) => {
    if (!column.sortable || !onSort) return
    // TODO: 实现排序逻辑
    onSort(column.key, 'asc')
  }

  const renderPagination = () => {
    if (!pagination || !onPageChange) return null

    const { page, totalPages } = pagination
    const pages = []
    
    // 计算显示的页码范围
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, page + 2)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          显示第 {((page - 1) * pagination.limit) + 1} - {Math.min(page * pagination.limit, pagination.total)} 条，
          共 {pagination.total} 条记录
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {pages.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700', className)}>
        <div className="animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700', className)}>
      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            {emptyText}
          </div>
          {emptyDescription && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {emptyDescription}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                        column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                      style={{ width: column.width }}
                      onClick={() => handleSort(column)}
                    >
                      {column.title}
                      {column.sortable && (
                        <span className="ml-1">↕</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render 
                          ? column.render(record[column.key], record, index)
                          : record[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {renderPagination()}
        </>
      )}
    </div>
  )
}
