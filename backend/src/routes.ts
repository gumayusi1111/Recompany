import express from 'express'
import fs from 'fs'
import path from 'path'

/**
 * 主路由文件 - 使用更灵活的路由注册方式
 * 以下是路由配置，使用对象结构记录每个模块的路由配置
 */

const router = express.Router()

// 定义模块配置
const moduleConfigs = [
  {
    path: '/api/home',
    modulePath: './modules/home',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/about',
    modulePath: './modules/about',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/contact',
    modulePath: './modules/contact',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/products',
    modulePath: './modules/products',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/projects',
    modulePath: './modules/projects',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/materials',
    modulePath: './modules/materials',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/testimonials',
    modulePath: './modules/testimonials',
    isModularized: true  // 已完成模块化重构
  },
  {
    path: '/api/news',
    modulePath: './modules/news',
    isModularized: true  // 已完成模块化重构
  }
]

// 动态注册路由
moduleConfigs.forEach(config => {
  try {
    // 动态导入路由模块
    const moduleRouter = require(config.modulePath).default
    if (moduleRouter) {
      // 注册路由
      router.use(config.path, moduleRouter)
      console.log(`成功注册路由: ${config.path} -> ${config.modulePath}${config.isModularized ? ' (模块化)' : ''}`)
    } else {
      console.warn(`警告: 模块 ${config.modulePath} 没有默认导出路由`)
    }
  } catch (error) {
    console.error(`错误: 无法加载路由模块 ${config.modulePath}`, error)
  }
})

export default router