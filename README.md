# Company_RE 项目

## 结构说明

- `frontend/`: 前端项目（Next.js）
- `backend/`: 后端项目（Express + TypeScript + Prisma）
- `docker/`: Nginx 反向代理及 Docker 配置
- `docs/`: UML 图、接口文档、结构说明等

## 启动方式

### 开发环境
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 生产环境
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
