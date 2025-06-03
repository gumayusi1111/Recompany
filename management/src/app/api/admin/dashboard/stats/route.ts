/**
 * 仪表盘统计数据API
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    // 获取当前时间和时间范围
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastWeek = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000)

    // 并行获取所有统计数据
    const [
      // 访问统计
      todayVisitors,
      thisWeekVisitors,
      thisMonthVisitors,
      lastWeekVisitors,
      
      // 请求统计
      pendingRequests,
      processingRequests,
      completedRequests,
      totalRequests,
      urgentRequests,
      
      // 内容统计
      totalProducts,
      activeProducts,
      featuredProducts,
      totalCases,
      activeCases,
      featuredCases,
      totalHeroSlides,
      activeHeroSlides,
    ] = await Promise.all([
      // 访问统计查询
      prisma.accessLog.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      prisma.accessLog.count({
        where: {
          createdAt: { gte: thisWeek }
        }
      }),
      prisma.accessLog.count({
        where: {
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.accessLog.count({
        where: {
          createdAt: { 
            gte: lastWeek,
            lt: thisWeek
          }
        }
      }),
      
      // 请求统计查询
      prisma.userRequest.count({
        where: { status: 'PENDING' }
      }),
      prisma.userRequest.count({
        where: { status: 'PROCESSING' }
      }),
      prisma.userRequest.count({
        where: { status: 'COMPLETED' }
      }),
      prisma.userRequest.count(),
      prisma.userRequest.count({
        where: { 
          status: { in: ['PENDING', 'PROCESSING'] },
          priority: 'HIGH'
        }
      }),
      
      // 内容统计查询
      prisma.product.count(),
      prisma.product.count({
        where: { isActive: true }
      }),
      prisma.product.count({
        where: { 
          isActive: true,
          isFeatured: true
        }
      }),
      prisma.engineeringCase.count(),
      prisma.engineeringCase.count({
        where: { isActive: true }
      }),
      prisma.engineeringCase.count({
        where: { 
          isActive: true,
          isFeatured: true
        }
      }),
      prisma.heroSlide.count(),
      prisma.heroSlide.count({
        where: { isActive: true }
      }),
    ])

    // 计算访客趋势
    const visitorTrend = lastWeekVisitors > 0 
      ? ((thisWeekVisitors - lastWeekVisitors) / lastWeekVisitors) * 100
      : thisWeekVisitors > 0 ? 100 : 0

    // 计算系统运行时间（模拟数据，实际应该从系统启动时间计算）
    const systemStartTime = new Date('2024-01-01')
    const uptime = Math.floor((now.getTime() - systemStartTime.getTime()) / (1000 * 60 * 60))

    // 计算平均响应时间（从访问日志中获取）
    const avgResponseTime = await prisma.accessLog.aggregate({
      _avg: {
        responseTime: true
      },
      where: {
        createdAt: { gte: today }
      }
    })

    // 计算错误率
    const totalRequestsToday = await prisma.accessLog.count({
      where: {
        createdAt: { gte: today }
      }
    })
    
    const errorRequestsToday = await prisma.accessLog.count({
      where: {
        createdAt: { gte: today },
        statusCode: { gte: 400 }
      }
    })

    const errorRate = totalRequestsToday > 0 
      ? (errorRequestsToday / totalRequestsToday) * 100 
      : 0

    // 构造响应数据
    const stats = {
      visitors: {
        today: todayVisitors,
        thisWeek: thisWeekVisitors,
        thisMonth: thisMonthVisitors,
        trend: Number(visitorTrend.toFixed(1))
      },
      requests: {
        pending: pendingRequests,
        processing: processingRequests,
        completed: completedRequests,
        total: totalRequests,
        urgent: urgentRequests
      },
      content: {
        products: {
          total: totalProducts,
          active: activeProducts,
          featured: featuredProducts
        },
        cases: {
          total: totalCases,
          active: activeCases,
          featured: featuredCases
        },
        heroSlides: {
          total: totalHeroSlides,
          active: activeHeroSlides
        }
      },
      system: {
        uptime: uptime,
        responseTime: Math.round(avgResponseTime._avg.responseTime || 0),
        errorRate: Number(errorRate.toFixed(2))
      }
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    
    // 返回默认数据以防数据库查询失败
    const defaultStats = {
      visitors: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        trend: 0
      },
      requests: {
        pending: 0,
        processing: 0,
        completed: 0,
        total: 0,
        urgent: 0
      },
      content: {
        products: {
          total: 0,
          active: 0,
          featured: 0
        },
        cases: {
          total: 0,
          active: 0,
          featured: 0
        },
        heroSlides: {
          total: 0,
          active: 0
        }
      },
      system: {
        uptime: 0,
        responseTime: 0,
        errorRate: 0
      }
    }

    return NextResponse.json({
      success: true,
      data: defaultStats
    })
  }
}
