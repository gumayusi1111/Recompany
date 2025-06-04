#!/bin/bash

# 🚀 生产环境部署完整示例
# 这个脚本展示了从开发环境到生产环境的完整部署流程

echo "🌍 Company RE 生产环境部署示例"
echo "================================"

# 步骤1：准备生产环境配置
echo "📝 步骤1：准备生产环境配置"
echo "1. 复制生产环境配置模板"
cp .env.production .env.production.local

echo "2. 编辑生产环境配置（请手动完成）"
echo "   需要修改的关键配置："
echo "   - POSTGRES_PASSWORD=your_secure_production_password"
echo "   - NEXT_PUBLIC_API_BASE=https://your-domain.com/api"
echo "   - DATABASE_URL=postgresql://postgres:your_password@db:5432/company_re_prod"

read -p "配置已完成？按Enter继续..."

# 步骤2：验证配置文件
echo ""
echo "📋 步骤2：验证配置文件"
if [ ! -f ".env.production.local" ]; then
    echo "❌ 错误：.env.production.local 文件不存在"
    exit 1
fi

echo "✅ 配置文件检查通过"

# 步骤3：构建和部署
echo ""
echo "🔨 步骤3：构建和部署"
echo "使用部署脚本进行自动化部署..."

# 使用本地配置文件
mv .env.production.local .env.production

# 执行部署
./deploy.sh production

# 步骤4：部署后验证
echo ""
echo "✅ 步骤4：部署后验证"

echo "检查容器状态："
docker compose --env-file .env.production ps

echo ""
echo "检查卷状态："
docker volume ls | grep company_re_prod

echo ""
echo "检查服务日志："
docker compose --env-file .env.production logs --tail=20

echo ""
echo "🎉 生产环境部署完成！"
echo ""
echo "📋 后续步骤："
echo "1. 配置反向代理（Nginx/Apache）"
echo "2. 设置SSL证书"
echo "3. 配置域名解析"
echo "4. 设置监控和日志"
echo "5. 配置备份策略"

echo ""
echo "🔗 访问地址："
echo "- 前端：http://your-server:3000"
echo "- 后端API：http://your-server:3002"
echo "- 管理后台：http://your-server:3001"
