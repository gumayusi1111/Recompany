# Docker使用文档

## 项目Docker化概述

本项目使用Docker Compose管理多个容器，包括：

- **前端**：Next.js 15.3.3应用，使用Node.js 20构建
- **后端**：Express 5.1.0 API服务，使用Node.js 20和Prisma ORM
- **数据库**：PostgreSQL 15
- **反向代理**：Nginx最新版本

## 容器健康检查

所有服务都配置了健康检查，帮助Docker监控容器状态：

- **前端**：通过HTTP检查`http://localhost:3000`
- **后端**：通过HTTP检查`http://localhost:3001/api/health`
- **数据库**：使用`pg_isready`命令
- **Nginx**：使用`service nginx status`命令

## 常用命令

### 构建并启动所有服务
```bash
docker compose build
docker compose up -d
```

### 验证容器状态
```bash
docker compose ps
```

### 查看容器日志
```bash
# 查看所有容器日志
docker compose logs

# 查看特定容器日志（例如后端）
docker compose logs backend

# 持续查看日志
docker compose logs -f
```

### 进入容器内部
```bash
# 进入后端容器
docker compose exec backend sh

# 进入前端容器
docker compose exec frontend sh

# 进入数据库容器
docker compose exec db psql -U postgres
```

### 停止和删除容器
```bash
# 停止所有容器
docker compose stop

# 停止并删除所有容器（保留数据卷）
docker compose down

# 停止并删除所有容器和数据卷（会丢失数据）
docker compose down -v
```

## 端口映射

- 前端：`3000` → `3000`
- 后端：`3001` → `3001`
- 数据库：`5432` → `5432`
- Nginx：`80/443` → `80/443`

## 持久化数据

数据库数据通过Docker卷`postgres_data`持久化存储。

## 环境变量

所有服务通过根目录下的`.env`文件获取环境变量：

```
PORT=3001
FRONTEND_PORT=3000
```

可根据需要在`.env`文件中添加更多变量。
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"