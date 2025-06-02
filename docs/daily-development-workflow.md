# 📅 日常开发流程指南

## 📖 目录
1. [每日启动流程](#每日启动流程)
2. [服务状态检查](#服务状态检查)
3. [常用调试命令](#常用调试命令)
4. [问题排查清单](#问题排查清单)
5. [开发结束流程](#开发结束流程)

---

## 🚀 每日启动流程

### 第1步：环境准备
```bash
# 1. 进入项目目录
cd /path/to/company_Re

# 2. 检查Docker服务状态
docker --version
docker compose --version

# 3. 检查端口占用情况
lsof -i :3000  # 前端端口
lsof -i :3001  # 后端端口
lsof -i :5432  # 数据库端口
lsof -i :5555  # Prisma Studio端口
```

### 第2步：启动开发环境
```bash
# 方法1：启动完整开发环境（推荐）
make up-dev

# 方法2：分步启动（调试时使用）
make db-only          # 先启动数据库
# 等待数据库启动完成后
make up-dev           # 启动所有服务
```

### 第3步：验证服务启动
```bash
# 检查所有容器状态
docker compose ps

# 应该看到以下服务状态为 "running"：
# - company_re-db-1
# - company_re-backend-1  
# - company_re-frontend-1
# - company_re-nginx-1
```

### 第4步：访问验证
```bash
# 前端访问测试
curl http://localhost:3000

# 后端健康检查（如果配置正确）
curl http://localhost:3001/api/health

# 数据库连接测试
docker compose exec db psql -U postgres -d company_re -c "SELECT version();"
```

---

## 🔍 服务状态检查

### 快速状态检查命令

#### 一键检查脚本
```bash
#!/bin/bash
echo "=== Docker 服务状态 ==="
docker compose ps

echo -e "\n=== 端口占用情况 ==="
echo "前端 (3000): $(lsof -ti :3000 | wc -l) 个进程"
echo "后端 (3001): $(lsof -ti :3001 | wc -l) 个进程"
echo "数据库 (5432): $(lsof -ti :5432 | wc -l) 个进程"

echo -e "\n=== 服务响应测试 ==="
curl -s -o /dev/null -w "前端状态: %{http_code}\n" http://localhost:3000
curl -s -o /dev/null -w "后端状态: %{http_code}\n" http://localhost:3001

echo -e "\n=== 数据库连接测试 ==="
docker compose exec -T db psql -U postgres -d company_re -c "SELECT 'Database OK';" 2>/dev/null || echo "数据库连接失败"
```

#### 详细状态检查

##### 1. 容器健康状态
```bash
# 查看容器详细状态
docker compose ps -a

# 查看容器资源使用
docker stats --no-stream

# 查看容器启动时间
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

##### 2. 服务日志检查
```bash
# 查看所有服务日志
make logs

# 查看特定服务日志
docker compose logs backend
docker compose logs frontend
docker compose logs db

# 查看最近的错误日志
docker compose logs --tail=50 | grep -i error
```

##### 3. 网络连接检查
```bash
# 检查容器间网络连通性
docker compose exec backend ping -c 3 db
docker compose exec frontend ping -c 3 backend

# 检查外部网络访问
docker compose exec backend curl -s http://www.google.com
```

---

## 🛠️ 常用调试命令

### 数据库操作命令

#### 连接数据库
```bash
# 进入数据库容器
docker compose exec db psql -U postgres -d company_re

# 常用SQL命令
\dt                    # 查看所有表
\d table_name         # 查看表结构
\du                   # 查看用户
\l                    # 查看数据库列表
\q                    # 退出
```

#### Prisma操作命令
```bash
# 进入backend目录
cd backend

# 生成Prisma客户端
npx prisma generate

# 查看数据库状态
npx prisma migrate status

# 重置数据库（开发环境）
npx prisma migrate reset

# 启动Prisma Studio
npx prisma studio
```

### 后端调试命令

#### 进入后端容器
```bash
# 进入后端容器
docker compose exec backend sh

# 查看Node.js进程
ps aux | grep node

# 查看环境变量
env | grep DATABASE

# 查看应用日志
tail -f /app/logs/app.log  # 如果有日志文件
```

#### 后端代码调试
```bash
# 重新构建后端
docker compose build backend --no-cache

# 重启后端服务
docker compose restart backend

# 查看后端构建日志
docker compose logs backend | grep -i build
```

### 前端调试命令

#### 进入前端容器
```bash
# 进入前端容器
docker compose exec frontend sh

# 查看Next.js进程
ps aux | grep next

# 查看构建状态
ls -la .next/

# 查看依赖安装
npm list --depth=0
```

#### 前端开发调试
```bash
# 重新构建前端
docker compose build frontend --no-cache

# 重启前端服务
docker compose restart frontend

# 查看前端构建日志
docker compose logs frontend | grep -i build
```

---

## 🚨 问题排查清单

### 常见问题及解决方案

#### 问题1：容器启动失败

**排查步骤：**
```bash
# 1. 查看容器状态
docker compose ps -a

# 2. 查看失败容器的日志
docker compose logs [服务名]

# 3. 检查端口冲突
lsof -i :3001
lsof -i :3000
lsof -i :5432

# 4. 检查磁盘空间
df -h

# 5. 重新构建容器
docker compose build --no-cache [服务名]
```

#### 问题2：数据库连接失败

**排查步骤：**
```bash
# 1. 检查数据库容器状态
docker compose ps db

# 2. 查看数据库日志
docker compose logs db

# 3. 测试数据库连接
docker compose exec db psql -U postgres -d company_re

# 4. 检查环境变量
echo $DATABASE_URL

# 5. 重启数据库
docker compose restart db
```

#### 问题3：API接口无响应

**排查步骤：**
```bash
# 1. 检查后端容器状态
docker compose ps backend

# 2. 测试后端端口
curl http://localhost:3001

# 3. 查看后端日志
docker compose logs backend

# 4. 检查路由配置
docker compose exec backend cat /app/dist/app.js | grep -A 5 -B 5 "routes"

# 5. 重启后端服务
docker compose restart backend
```

#### 问题4：前端页面无法访问

**排查步骤：**
```bash
# 1. 检查前端容器状态
docker compose ps frontend

# 2. 测试前端端口
curl http://localhost:3000

# 3. 查看前端日志
docker compose logs frontend

# 4. 检查构建状态
docker compose exec frontend ls -la .next/

# 5. 重新构建前端
docker compose build frontend --no-cache
```

### 系统性问题排查

#### 完整重启流程
```bash
# 1. 停止所有服务
make down

# 2. 清理Docker缓存（可选）
docker system prune -f

# 3. 重新构建所有服务
docker compose build --no-cache

# 4. 启动开发环境
make up-dev

# 5. 验证所有服务
docker compose ps
```

#### 数据库重置流程
```bash
# 1. 停止所有服务
make down

# 2. 删除数据库卷（会丢失所有数据）
docker volume rm company_re_postgres_data

# 3. 重新启动
make up-dev

# 4. 重新运行迁移
cd backend && npx prisma migrate dev
```

---

## 🔚 开发结束流程

### 正常结束流程
```bash
# 1. 保存所有代码更改
git add .
git commit -m "描述今天的开发内容"

# 2. 停止开发服务（保留数据）
make down

# 3. 检查是否有残留进程
docker ps -a
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

### 完全清理流程（谨慎使用）
```bash
# 1. 停止所有容器
docker compose down

# 2. 删除所有容器和网络
docker compose down --remove-orphans

# 3. 清理未使用的镜像
docker image prune -f

# 4. 清理未使用的卷（会删除数据库数据）
docker volume prune -f

# 5. 清理系统缓存
docker system prune -f
```

### 开发环境备份
```bash
# 1. 备份数据库
docker compose exec db pg_dump -U postgres company_re > backup_$(date +%Y%m%d).sql

# 2. 备份环境配置
cp env.dev env.dev.backup
cp .env .env.backup

# 3. 记录当前状态
docker compose ps > docker_status_$(date +%Y%m%d).txt
```

---

## 📝 日常开发检查清单

### 开始开发前
- [ ] 检查Docker服务是否运行
- [ ] 启动开发环境：`make up-dev`
- [ ] 验证所有服务状态：`docker compose ps`
- [ ] 测试前端访问：`curl http://localhost:3000`
- [ ] 测试后端访问：`curl http://localhost:3001`
- [ ] 启动Prisma Studio：`cd backend && npx prisma studio`

### 开发过程中
- [ ] 定期查看服务日志：`make logs`
- [ ] 监控容器资源使用：`docker stats`
- [ ] 及时提交代码更改：`git commit`
- [ ] 测试新功能是否正常工作

### 结束开发后
- [ ] 保存所有代码更改
- [ ] 停止开发服务：`make down`
- [ ] 检查是否有残留进程
- [ ] 备份重要数据（如需要）

按照这个流程，可以确保每天的开发工作顺利进行，减少环境问题带来的困扰。
