# 🏗️ Docker镜像构建和管理指南

## 📊 镜像构建策略对比

| 环境 | 构建方式 | 镜像标签 | 用途 |
|------|----------|----------|------|
| **开发** | 本地构建 | `company_re-frontend:latest` | 快速迭代开发 |
| **测试** | CI/CD构建 | `company_re-frontend:staging-v1.0.0` | 测试验证 |
| **生产** | CI/CD构建 | `company_re-frontend:prod-v1.0.0` | 生产部署 |

## 🔨 构建过程详解

### 开发环境构建
```bash
# deploy.sh 中的构建过程
docker compose --env-file .env.development build

# 等同于
docker build -t company_re_dev-frontend ./frontend
docker build -t company_re_dev-backend ./backend
docker build -t company_re_dev-management ./management
```

### 生产环境构建
```bash
# deploy.sh 中的生产构建
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml build

# 包含生产优化：
# - 多阶段构建
# - 依赖缓存优化
# - 镜像大小优化
```

## 🏷️ 镜像标签管理

### 推荐标签策略
```bash
# 开发环境
company_re-frontend:dev-latest
company_re-backend:dev-latest

# 测试环境
company_re-frontend:staging-v1.0.0
company_re-backend:staging-v1.0.0

# 生产环境
company_re-frontend:prod-v1.0.0
company_re-backend:prod-v1.0.0
```

## 🚀 CI/CD集成示例

### GitHub Actions 示例
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Images
        run: |
          docker compose -f docker-compose.yml -f docker-compose.prod.yml build
          
      - name: Tag Images
        run: |
          docker tag company_re-frontend:latest company_re-frontend:prod-${{ github.sha }}
          docker tag company_re-backend:latest company_re-backend:prod-${{ github.sha }}
          
      - name: Deploy to Production
        run: |
          ./deploy.sh production
```

## 📦 镜像优化建议

1. **使用多阶段构建**
2. **优化层缓存**
3. **最小化镜像大小**
4. **安全扫描**
5. **版本管理**
