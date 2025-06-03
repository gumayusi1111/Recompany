# 部署指南

## 🚀 生产环境部署

### 环境要求
- Node.js 18+
- PostgreSQL 12+
- Nginx (推荐)
- SSL证书
- 域名

### 1. 服务器准备

#### Ubuntu/Debian 系统
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PostgreSQL
sudo apt install postgresql postgresql-contrib

# 安装Nginx
sudo apt install nginx

# 安装PM2 (进程管理器)
sudo npm install -g pm2
```

#### CentOS/RHEL 系统
```bash
# 更新系统
sudo yum update -y

# 安装Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 安装PostgreSQL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 安装Nginx
sudo yum install nginx

# 安装PM2
sudo npm install -g pm2
```

### 2. 数据库配置

```bash
# 切换到postgres用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE membrane_db;
CREATE USER membrane_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE membrane_db TO membrane_user;
\q
```

### 3. 项目部署

```bash
# 创建项目目录
sudo mkdir -p /var/www/membrane-management
sudo chown $USER:$USER /var/www/membrane-management

# 克隆项目
cd /var/www/membrane-management
git clone <your-repo-url> .

# 安装依赖
npm ci --only=production

# 创建生产环境配置
cp .env.example .env.production
```

### 4. 环境变量配置

编辑 `.env.production` 文件：

```env
# 生产环境配置
NODE_ENV=production

# 数据库配置
DATABASE_URL="postgresql://membrane_user:your_secure_password@localhost:5432/membrane_db"

# JWT配置
JWT_SECRET="your-super-secure-jwt-secret-at-least-32-characters"
JWT_EXPIRES_IN="7d"

# 应用配置
NEXTAUTH_URL="https://admin.yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret"

# 默认管理员密码
DEFAULT_ADMIN_PASSWORD="your-secure-admin-password"

# 文件上传配置
UPLOAD_DIR="/var/www/membrane-management/public/uploads"
MAX_FILE_SIZE="10485760"

# 前端项目URL
FRONTEND_URL="https://yourdomain.com"

# 安全配置
CORS_ORIGIN="https://yourdomain.com,https://admin.yourdomain.com"
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"
```

### 5. 构建项目

```bash
# 生成Prisma客户端
npm run db:generate

# 推送数据库schema
npm run db:push

# 构建项目
npm run build
```

### 6. PM2 配置

创建 `ecosystem.config.js` 文件：

```javascript
module.exports = {
  apps: [{
    name: 'membrane-management',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/membrane-management',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/membrane-management/error.log',
    out_file: '/var/log/membrane-management/out.log',
    log_file: '/var/log/membrane-management/combined.log',
    time: true
  }]
}
```

### 7. 启动应用

```bash
# 创建日志目录
sudo mkdir -p /var/log/membrane-management
sudo chown $USER:$USER /var/log/membrane-management

# 启动应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

### 8. Nginx 配置

创建 `/etc/nginx/sites-available/membrane-management` 文件：

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    # SSL配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头部
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 代理到Next.js应用
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 上传文件
    location /uploads {
        alias /var/www/membrane-management/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 限制文件上传大小
    client_max_body_size 10M;
}
```

启用站点：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/membrane-management /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 🐳 Docker 部署

### 1. Dockerfile

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 构建Next.js应用
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 设置正确的权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://membrane_user:password@db:5432/membrane_db
      - JWT_SECRET=your-jwt-secret
      - NEXTAUTH_URL=https://admin.yourdomain.com
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=membrane_db
      - POSTGRES_USER=membrane_user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. 部署命令

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔧 维护和监控

### 1. 日志管理

```bash
# 查看PM2日志
pm2 logs membrane-management

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 日志轮转配置
sudo nano /etc/logrotate.d/membrane-management
```

### 2. 备份策略

```bash
#!/bin/bash
# backup.sh - 数据库备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/membrane"
DB_NAME="membrane_db"
DB_USER="membrane_user"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# 文件备份
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/membrane-management/public/uploads

# 清理旧备份（保留30天）
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### 3. 监控配置

```bash
# 安装监控工具
sudo npm install -g pm2-logrotate
pm2 install pm2-server-monit

# 设置监控
pm2 monitor
```

### 4. 更新部署

```bash
#!/bin/bash
# deploy.sh - 自动部署脚本

echo "开始部署..."

# 拉取最新代码
git pull origin main

# 安装依赖
npm ci --only=production

# 数据库迁移
npm run db:push

# 构建项目
npm run build

# 重启应用
pm2 restart membrane-management

echo "部署完成！"
```

## 🔒 安全加固

### 1. 防火墙配置

```bash
# UFW防火墙
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3001  # 禁止直接访问应用端口
```

### 2. SSL证书

```bash
# 使用Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d admin.yourdomain.com
```

### 3. 安全更新

```bash
# 定期更新系统
sudo apt update && sudo apt upgrade -y

# 更新Node.js依赖
npm audit fix
```

## 📊 性能优化

### 1. 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_user_requests_status ON user_requests(status);
CREATE INDEX idx_user_requests_created_at ON user_requests(created_at);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at);
```

### 2. 缓存配置

```nginx
# Nginx缓存配置
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 压缩配置

```nginx
# Gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

---

部署完成后，请访问 `https://admin.yourdomain.com` 进行测试。
