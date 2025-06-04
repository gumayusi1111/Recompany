#!/bin/bash

# 卷迁移脚本：从旧命名迁移到新命名
# 用途：安全迁移现有卷到新的命名规范

echo "🔄 Docker卷迁移脚本"
echo "从旧命名迁移到新的环境隔离命名"
echo "================================"

# 停止服务
echo "⏹️  停止当前服务..."
docker compose down

# 创建新卷
echo "📦 创建新的命名卷..."
docker volume create company_re_dev_postgres_data
docker volume create company_re_dev_frontend_node_modules
docker volume create company_re_dev_backend_node_modules
docker volume create company_re_dev_management_node_modules

# 迁移数据
echo "🔄 迁移卷数据..."

# 迁移postgres数据
echo "迁移postgres数据..."
docker run --rm \
  -v company_re_postgres_data:/source \
  -v company_re_dev_postgres_data:/target \
  alpine sh -c "cp -a /source/. /target/"

# 迁移frontend node_modules
echo "迁移frontend node_modules..."
docker run --rm \
  -v company_re_company_re_frontend_node_modules:/source \
  -v company_re_dev_frontend_node_modules:/target \
  alpine sh -c "cp -a /source/. /target/"

# 迁移backend node_modules
echo "迁移backend node_modules..."
docker run --rm \
  -v company_re_company_re_backend_node_modules:/source \
  -v company_re_dev_backend_node_modules:/target \
  alpine sh -c "cp -a /source/. /target/"

# 迁移management node_modules
echo "迁移management node_modules..."
docker run --rm \
  -v company_re_company_re_management_node_modules:/source \
  -v company_re_dev_management_node_modules:/target \
  alpine sh -c "cp -a /source/. /target/"

# 使用新配置启动
echo "🚀 使用新配置启动服务..."
docker compose --env-file .env.development up -d

echo "✅ 迁移完成！"
echo "📊 新的卷列表："
docker volume ls | grep company_re_dev

echo ""
echo "⚠️  验证服务正常后，可以删除旧卷："
echo "docker volume rm company_re_postgres_data"
echo "docker volume rm company_re_company_re_frontend_node_modules"
echo "docker volume rm company_re_company_re_backend_node_modules"
echo "docker volume rm company_re_company_re_management_node_modules"
