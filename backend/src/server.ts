import app from './app'
import setupSwagger from './swagger'

// 初始化 swagger（放在 app.use(routes) 前或后均可）
setupSwagger(app)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
