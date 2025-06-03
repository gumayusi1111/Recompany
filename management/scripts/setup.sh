#!/bin/bash

# 亚豪膜结构管理系统安装脚本
# 用于快速设置开发环境

set -e

echo "🚀 亚豪膜结构管理系统 - 环境设置"
echo "=================================="

# 检查Node.js版本
echo "📋 检查环境要求..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查包管理器
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn"
else
    PKG_MANAGER="npm"
fi

echo "📦 使用包管理器: $PKG_MANAGER"

# 安装依赖
echo "📥 安装项目依赖..."
$PKG_MANAGER install

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚙️ 创建环境配置文件..."
    cp .env.example .env.local
    echo "✅ 已创建 .env.local 文件"
    echo "⚠️  请编辑 .env.local 文件，配置数据库连接信息"
else
    echo "✅ 环境配置文件已存在"
fi

# 检查数据库连接
echo "🗄️ 检查数据库配置..."
if grep -q "postgresql://username:password@localhost:5432/membrane_db" .env.local; then
    echo "⚠️  请更新 .env.local 中的数据库连接信息"
    echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/membrane_db\""
fi

# 生成Prisma客户端
echo "🔧 生成Prisma客户端..."
$PKG_MANAGER run db:generate

# 询问是否推送数据库schema
echo ""
read -p "🗄️ 是否推送数据库schema? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 推送数据库schema..."
    $PKG_MANAGER run db:push
    echo "✅ 数据库schema已推送"
else
    echo "⏭️ 跳过数据库schema推送"
    echo "   稍后可运行: $PKG_MANAGER run db:push"
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p public/uploads
mkdir -p logs
echo "✅ 目录创建完成"

# 设置权限
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    chmod +x scripts/*.sh
    echo "✅ 脚本权限设置完成"
fi

echo ""
echo "🎉 安装完成！"
echo "=================================="
echo ""
echo "📋 下一步操作："
echo "1. 编辑 .env.local 文件，配置数据库连接"
echo "2. 运行数据库迁移: $PKG_MANAGER run db:push"
echo "3. 启动开发服务器: $PKG_MANAGER run dev"
echo ""
echo "🌐 访问地址: http://localhost:3001"
echo "👤 默认管理员账户:"
echo "   用户名: admin"
echo "   密码: admin123456"
echo ""
echo "⚠️  首次登录后请立即修改密码！"
echo ""
echo "📚 更多信息请查看 README.md"
