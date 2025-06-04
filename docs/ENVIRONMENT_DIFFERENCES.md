# 🔄 环境切换配置差异指南

## 📊 环境配置对比表

| 配置项 | 开发环境 | 生产环境 | 注意事项 |
|--------|----------|----------|----------|
| **项目名** | `company_re_dev` | `company_re_prod` | 影响卷命名 |
| **数据库密码** | `postgres` | `强密码` | ⚠️ 安全关键 |
| **API地址** | `localhost:3002` | `https://api.domain.com` | 域名配置 |
| **NODE_ENV** | `development` | `production` | 影响构建优化 |
| **重启策略** | 无 | `unless-stopped` | 生产稳定性 |
| **资源限制** | 无 | 有限制 | 防止资源耗尽 |
| **外部卷** | 否 | 是 | 数据安全 |

## ⚠️ 潜在问题和解决方案

### 1. 数据库连接问题
```bash
# 问题：生产环境数据库连接失败
# 原因：DATABASE_URL配置错误

# 解决方案：检查配置
grep DATABASE_URL .env.production
# 确保格式：postgresql://user:password@host:port/database
```

### 2. API地址配置问题
```bash
# 问题：前端无法连接后端API
# 原因：NEXT_PUBLIC_API_BASE配置错误

# 解决方案：
# 开发环境：http://localhost:3002/api
# 生产环境：https://your-domain.com/api
```

### 3. 卷权限问题
```bash
# 问题：容器无法写入卷
# 原因：卷权限配置错误

# 解决方案：检查卷权限
docker exec -it company_re_prod-backend-1 ls -la /app/node_modules
```

### 4. 内存不足问题
```bash
# 问题：容器因内存不足被杀死
# 原因：生产环境资源限制

# 解决方案：调整资源限制
# 在docker-compose.prod.yml中修改：
deploy:
  resources:
    limits:
      memory: 2G  # 增加内存限制
```

## 🔧 环境切换检查清单

### 部署前检查
- [ ] 修改.env.production中的敏感信息
- [ ] 确认域名和SSL证书配置
- [ ] 检查防火墙和网络配置
- [ ] 验证数据库连接字符串
- [ ] 确认备份策略

### 部署后验证
- [ ] 检查所有容器状态
- [ ] 验证API接口可访问
- [ ] 测试前端页面加载
- [ ] 检查日志无错误
- [ ] 验证数据库连接

## 🚨 紧急回滚程序

如果生产部署出现问题：

```bash
# 1. 立即停止有问题的服务
docker compose --env-file .env.production down

# 2. 回滚到上一个版本（如果有镜像标签）
docker tag company_re-frontend:prod-v1.0.0 company_re-frontend:latest

# 3. 重新启动
./deploy.sh production

# 4. 检查服务状态
docker compose --env-file .env.production ps
```
