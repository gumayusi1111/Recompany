# 管理系统Dockerfile
FROM node:18-alpine

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat wget

# 设置工作目录
WORKDIR /app

# 复制包管理文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=development
ENV PORT=3001

# 启动开发服务器
CMD ["npm", "run", "dev"]