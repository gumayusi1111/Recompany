# 🐳 Docker 配置完整说明

## 📖 目录
1. [Docker架构概览](#docker架构概览)
2. [环境配置说明](#环境配置说明)
3. [启动流程详解](#启动流程详解)
4. [容器状态管理](#容器状态管理)
5. [常见问题排查](#常见问题排查)

---

## 🏗️ Docker架构概览

### 项目Docker配置特点

本项目使用**单一docker-compose.yml文件**配置，通过不同的环境变量文件来区分开发和生产环境：

```
项目根目录/
├── docker-compose.yml     # 主配置文件
├── env.dev               # 开发环境变量
├── env.prod              # 生产环境变量
├── makefile              # 便捷启动命令
└── docs/                 # 文档目录
```

### 服务架构

- **前端**：Next.js 15.3.3应用 (端口 3000)
- **后端**：Express 5.1.0 API服务 (端口 3001)
- **数据库**：PostgreSQL 15 (端口 5432)
- **反向代理**：Nginx (端口 80/443)
- **Prisma Studio**：数据库可视化工具 (端口 5555)

---

## ⚙️ 环境配置说明

### 开发环境 (env.dev)
```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re

# 前端配置
FRONTEND_PORT=3000
NODE_ENV=development

# 后端配置
PORT=3001
```

### 生产环境 (env.prod)
```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re

# 前端配置
FRONTEND_PORT=3000
NODE_ENV=production

# 后端配置
PORT=3001
```

### 数据库连接说明

**重要概念：容器内外连接差异**

- **容器外访问**（如Prisma命令）：`localhost:5432`
- **容器内访问**（如应用运行时）：`db:5432`

```bash
# backend/.env (用于Prisma命令)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re

# env.dev/env.prod (用于容器内应用)
DATABASE_URL=postgresql://postgres:postgres@db:5432/company_re
```

---

## 🚀 启动流程详解

### 开发环境启动

#### 方法1：使用Makefile（推荐）
```bash
# 启动完整开发环境
make up-dev

# 仅启动数据库（用于Prisma操作）
make db-only

# 停止所有服务
make down

# 查看日志
make logs

# 重启服务
make restart
```

#### 方法2：直接使用Docker Compose
```bash
# 启动完整开发环境
docker compose --env-file env.dev up --build

# 仅启动数据库
docker compose --env-file env.dev up -d db

# 停止所有服务
docker compose down
```

### 生产环境启动

```bash
# 生产环境启动（后台运行）
make up-prod

# 等同于
docker compose --env-file env.prod up --build -d
```

### 服务启动顺序

1. **数据库服务** (PostgreSQL) - 首先启动
2. **后端服务** (Express + Prisma) - 等待数据库健康检查通过
3. **前端服务** (Next.js) - 独立启动
4. **反向代理** (Nginx) - 最后启动，代理前后端请求

---

## 📊 容器状态管理

### 查看容器状态

```bash
# 查看所有容器状态
docker compose ps

# 查看容器详细信息
docker compose ps -a

# 查看容器资源使用
docker stats
```

### 查看日志

```bash
# 查看所有容器日志
docker compose logs

# 查看特定容器日志
docker compose logs backend
docker compose logs frontend
docker compose logs db

# 实时查看日志
docker compose logs -f

# 查看最近的日志
docker compose logs --tail=50
```

### 容器操作

```bash
# 重启特定服务
docker compose restart backend

# 强制重建容器（无缓存）
docker compose build --no-cache backend

# 重建并启动
docker compose up --build backend

# 进入容器内部
docker compose exec backend sh
docker compose exec db psql -U postgres -d company_re
```

### 数据持久化

```bash
# 数据库数据卷
postgres_data:/var/lib/postgresql/data

# 应用代码挂载（开发环境）
./frontend:/app (前端代码)
./backend:/app (后端代码)
```

---

## 🔧 常见问题排查

### 问题1：端口冲突

**症状：** `Error: listen EADDRINUSE: address already in use :::3001`

**解决方案：**
```bash
# 查看端口占用
lsof -i :3001
lsof -i :3000
lsof -i :5432

# 停止占用进程
kill -9 [PID]

# 或者停止所有Docker容器
docker compose down
```

### 问题2：数据库连接失败

**症状：** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**排查步骤：**
```bash
# 1. 检查数据库容器状态
docker compose ps

# 2. 查看数据库日志
docker compose logs db

# 3. 测试数据库连接
docker compose exec db psql -U postgres -d company_re

# 4. 检查环境变量
echo $DATABASE_URL
```

### 问题3：Prisma命令失败

**症状：** `Error: Can't reach database server`

**解决方案：**
```bash
# 确保使用正确的数据库URL
cd backend
cat .env

# 应该显示：
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re

# 如果不正确，修改为：
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/company_re" > .env
```

### 问题4：容器构建失败

**症状：** 构建过程中出现依赖安装错误

**解决方案：**
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建（无缓存）
docker compose build --no-cache

# 检查磁盘空间
df -h

# 如果空间不足，清理无用镜像
docker image prune -a
```

### 问题5：健康检查失败

**症状：** 容器状态显示 `unhealthy`

**排查步骤：**
```bash
# 查看健康检查日志
docker compose ps
docker inspect [容器ID]

# 手动测试健康检查
curl http://localhost:3001/api/health
curl http://localhost:3000
```

---

## 🛠️ 开发调试技巧

### 进入容器调试

```bash
# 进入后端容器
docker compose exec backend sh

# 查看后端进程
docker compose exec backend ps aux

# 进入数据库容器
docker compose exec db psql -U postgres -d company_re

# 查看数据库表
\dt
```

### 查看容器资源使用

```bash
# 查看容器资源使用情况
docker stats

# 查看容器详细信息
docker compose exec backend cat /proc/meminfo
docker compose exec backend df -h
```

### 网络调试

```bash
# 查看Docker网络
docker network ls

# 检查容器间网络连通性
docker compose exec backend ping db
docker compose exec frontend ping backend
```

---

## 📝 最佳实践

### 开发环境建议

1. **使用make命令**：简化操作，减少错误
2. **定期清理**：`docker system prune` 清理无用镜像
3. **监控日志**：`make logs` 实时查看所有服务日志
4. **数据备份**：定期备份数据库数据

### 生产环境建议

1. **使用具体版本标签**：避免使用latest标签
2. **健康检查**：确保所有服务都配置了健康检查
3. **资源限制**：为容器设置内存和CPU限制
4. **安全配置**：使用非root用户运行容器

---

## 🔍 故障排查清单

遇到问题时，按以下顺序检查：

- [ ] Docker服务是否运行：`docker --version`
- [ ] 端口是否被占用：`lsof -i :3001`
- [ ] 环境变量是否正确：检查env.dev文件
- [ ] 容器状态是否正常：`docker compose ps`
- [ ] 日志是否有错误：`docker compose logs`
- [ ] 磁盘空间是否充足：`df -h`
- [ ] 网络连接是否正常：`docker compose exec backend ping db`

按照这个清单逐项检查，通常能快速定位和解决问题。

```
PORT=3001
FRONTEND_PORT=3000
```

可根据需要在`.env`文件中添加更多变量。
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"