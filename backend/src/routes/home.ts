/**
 * 首页API路由
 * 提供首页数据的RESTful API接口
 */

import { Router } from 'express'
import { getHomePage } from '../modules/home/services/home.service'

const router = Router()

/**
 * GET /api/home
 * 获取首页数据
 */
router.get('/', async (req, res) => {
  try {
    console.log('📡 收到首页数据请求')
    
    const homeData = await getHomePage()
    
    console.log('✅ 首页数据获取成功:', {
      id: homeData.id,
      isActive: homeData.isActive,
      hasData: !!homeData
    })

    // 返回标准API响应格式
    res.json({
      code: 0,
      msg: 'success',
      data: homeData
    })
  } catch (error) {
    console.error('❌ 首页数据获取失败:', error)
    
    res.status(500).json({
      code: 500,
      msg: error instanceof Error ? error.message : '获取首页数据失败',
      data: null
    })
  }
})

/**
 * POST /api/home
 * 更新首页数据（管理后台使用）
 */
router.post('/', async (req, res) => {
  try {
    console.log('📝 收到首页数据更新请求')
    
    // TODO: 实现首页数据更新逻辑
    // const updatedData = await updateHomePage(req.body)
    
    res.json({
      code: 0,
      msg: '首页数据更新成功',
      data: null
    })
  } catch (error) {
    console.error('❌ 首页数据更新失败:', error)
    
    res.status(500).json({
      code: 500,
      msg: error instanceof Error ? error.message : '更新首页数据失败',
      data: null
    })
  }
})

export default router
