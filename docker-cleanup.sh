#!/bin/bash

# Docker本地清理脚本
# 用途：安全清理本地Docker环境，保留开发必需的卷

echo "🧹 Docker本地环境清理脚本"
echo "================================"

# 显示当前Docker资源使用情况
echo "📊 当前Docker资源使用情况："
docker system df

echo ""
echo "🔍 当前卷列表："
docker volume ls

echo ""
echo "⚠️  以下卷将被保留（开发必需）："
echo "   - company_re_postgres_data (数据库数据)"
echo "   - company_re_company_re_*_node_modules (依赖缓存)"

echo ""
read -p "是否继续清理？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 清理已取消"
    exit 1
fi

echo ""
echo "🧹 开始清理..."

# 1. 清理停止的容器
echo "1️⃣ 清理停止的容器..."
docker container prune -f

# 2. 清理悬空镜像
echo "2️⃣ 清理悬空镜像..."
docker image prune -f

# 3. 清理构建缓存
echo "3️⃣ 清理构建缓存..."
docker builder prune -f

# 4. 清理未使用的网络
echo "4️⃣ 清理未使用的网络..."
docker network prune -f

# 5. 显示清理后的状态
echo ""
echo "✅ 清理完成！"
echo "📊 清理后的Docker资源使用情况："
docker system df

echo ""
echo "🔒 保留的重要卷："
docker volume ls | grep company_re

echo ""
echo "💡 提示："
echo "   - 数据库数据已保留"
echo "   - node_modules缓存已保留"
echo "   - 如需释放更多空间，可手动删除node_modules卷"
echo "   - 删除node_modules卷会导致下次启动时重新下载依赖"
