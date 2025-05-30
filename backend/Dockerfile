# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 安装Prisma并生成客户端
RUN npx prisma generate

# 构建应用
RUN npm run build

# 启动应用 - 使用生产环境命令
CMD ["npm", "run", "start"]