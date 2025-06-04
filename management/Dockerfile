# 管理系统多阶段Dockerfile
# 阶段1：构建阶段
FROM node:20-alpine AS builder

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 复制包管理文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci --legacy-peer-deps

# 复制源代码
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 构建应用
RUN npm run build

# 阶段2：生产阶段
FROM node:20-alpine AS runner

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制package.json用于生产依赖
COPY package.json package-lock.json* ./

# 只安装生产依赖
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# 从构建阶段复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 创建public目录并复制内容（如果存在）
RUN mkdir -p ./public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3001

# 启动生产服务器
CMD ["node", "server.js"]