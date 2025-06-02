import express from 'express'
import cors from 'cors'
import routes from './routes/index'          // ✅ 修改：使用新的路由系统
import setupSwagger from './swagger'         // ✅ 新增
import authRoutes from './routes/auth'       // ✅ 新增

const app = express()

app.use(cors())
app.use(express.json())

setupSwagger(app)                            // ✅ 添加 Swagger 接口文档
app.use('/auth', authRoutes)                 // ✅ 登录模块
app.use('/api', routes)                      // ✅ API路由前缀

app.get('/', (req, res) => {
  res.send('✅ API is running.')
})

export default app