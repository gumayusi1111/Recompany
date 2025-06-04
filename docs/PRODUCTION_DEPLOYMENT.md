# 🚀 生产环境部署指南

## 📋 部署前检查清单

### ✅ 必需文件确认
- [ ] `.env.production` - 生产环境配置
- [ ] `docker-compose.yml` - 基础配置
- [ ] `docker-compose.prod.yml` - 生产环境覆盖配置
- [ ] `deploy.sh` - 部署脚本

### ✅ 配置检查
- [ ] 修改 `.env.production` 中的密码
- [ ] 确认域名和API地址
- [ ] 检查端口配置
- [ ] 验证数据库连接字符串

## 🔧 部署步骤

### 步骤1：服务器准备
```bash
# 1. 确保Docker和Docker Compose已安装
docker --version
docker compose version

# 2. 创建项目目录
mkdir -p /opt/company-re
cd /opt/company-re

# 3. 上传项目文件（使用git clone或scp）
git clone <your-repo-url> .
# 或者
scp -r ./project-files/* user@server:/opt/company-re/
```

### 步骤2：配置生产环境
```bash
# 1. 复制并编辑生产环境配置
cp .env.production .env.production.local
nano .env.production.local

# 2. 修改关键配置：
# - POSTGRES_PASSWORD（使用强密码）
# - NEXT_PUBLIC_API_BASE（实际域名）
# - 其他敏感信息
```

### 步骤3：执行部署
```bash
# 使用部署脚本（推荐）
./deploy.sh production

# 或手动部署
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 步骤4：验证部署
```bash
# 检查服务状态
docker compose --env-file .env.production ps

# 检查日志
docker compose --env-file .env.production logs

# 检查卷
docker volume ls | grep company_re_prod
```

## ⚠️ 重要注意事项

1. **密码安全**：生产环境必须使用强密码
2. **域名配置**：确保API地址指向正确的生产域名
3. **防火墙**：配置适当的防火墙规则
4. **SSL证书**：配置HTTPS（通常通过反向代理）
5. **备份策略**：设置数据库定期备份

## 🔄 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deploy.sh production
```
