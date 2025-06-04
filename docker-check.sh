#!/bin/bash

# 简化的Docker配置检查脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Docker配置检查${NC}"
echo "===================="

# 检查必要文件
echo -e "\n${BLUE}📁 检查配置文件...${NC}"
files=(
    "docker-compose.yml"
    ".env"
    "env.dev"
    "env.prod"
    "makefile"
    "frontend/Dockerfile"
    "management/Dockerfile"
    "backend/Dockerfile"
    "docker/nginx/nginx.conf"
    "docker/nginx/conf.d/example.conf"
)

missing_files=0
for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (缺失)"
        ((missing_files++))
    fi
done

if [[ $missing_files -eq 0 ]]; then
    echo -e "${GREEN}✓ 所有配置文件都存在${NC}"
else
    echo -e "${RED}✗ 发现 $missing_files 个缺失文件${NC}"
fi

# 检查Docker命令
echo -e "\n${BLUE}🔧 检查Docker环境...${NC}"
if command -v docker >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker已安装: $(docker --version)"
else
    echo -e "${RED}✗${NC} Docker未安装"
    exit 1
fi

if docker compose version >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker Compose已安装: $(docker compose version)"
elif command -v docker-compose >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker Compose已安装: $(docker-compose --version)"
else
    echo -e "${RED}✗${NC} Docker Compose未安装"
    exit 1
fi

# 检查配置语法
echo -e "\n${BLUE}📋 检查配置语法...${NC}"
if docker compose --env-file env.dev config --quiet >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} docker-compose.yml 语法正确"
else
    echo -e "${RED}✗${NC} docker-compose.yml 语法错误"
    docker compose --env-file env.dev config 2>&1 | head -5
fi

# 检查端口配置
echo -e "\n${BLUE}🌐 检查端口配置...${NC}"
if grep -q "3000" docker-compose.yml; then
    echo -e "${GREEN}✓${NC} 前端端口 (3000)"
fi
if grep -q "3001" docker-compose.yml; then
    echo -e "${GREEN}✓${NC} 管理系统端口 (3001)"
fi
if grep -q "3002" docker-compose.yml; then
    echo -e "${GREEN}✓${NC} 后端端口 (3002)"
fi
if grep -q "5432" docker-compose.yml; then
    echo -e "${GREEN}✓${NC} 数据库端口 (5432)"
fi

# 检查环境变量
echo -e "\n${BLUE}⚙️ 检查环境变量...${NC}"
if grep -q "DATABASE_URL" .env; then
    echo -e "${GREEN}✓${NC} 数据库连接配置"
fi
if grep -q "NEXT_PUBLIC_API_BASE" .env; then
    echo -e "${GREEN}✓${NC} API基础URL配置"
fi

# 检查Nginx配置
echo -e "\n${BLUE}🔀 检查Nginx配置...${NC}"
nginx_conf="docker/nginx/conf.d/example.conf"
if grep -q "management:3001" "$nginx_conf"; then
    echo -e "${GREEN}✓${NC} 管理系统代理配置"
fi
if grep -q "backend:3002" "$nginx_conf"; then
    echo -e "${GREEN}✓${NC} 后端API代理配置"
fi
if grep -q "frontend:3000" "$nginx_conf"; then
    echo -e "${GREEN}✓${NC} 前端代理配置"
fi

echo -e "\n${BLUE}📊 配置摘要${NC}"
echo "=============="
echo "• 前端服务: http://localhost:3000"
echo "• 管理系统: http://localhost:3001"
echo "• 后端API: http://localhost:3002"
echo "• 数据库: localhost:5432"
echo "• Nginx代理: http://localhost:80"

echo -e "\n${BLUE}🚀 快速启动命令${NC}"
echo "=================="
echo "开发环境: make up-dev"
echo "生产环境: make up-prod"
echo "停止服务: make down"
echo "查看日志: make logs"

echo -e "\n${GREEN}✅ Docker配置检查完成！${NC}"

# 询问是否进行构建测试
echo ""
read -p "是否进行Docker构建测试？(y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}🔨 开始构建测试...${NC}"
    
    # 检查是否有运行中的容器
    if docker compose ps --services --filter "status=running" | grep -q .; then
        echo -e "${YELLOW}⚠️ 发现运行中的容器，先停止...${NC}"
        docker compose down
    fi
    
    # 构建测试
    echo -e "${BLUE}📦 构建所有服务...${NC}"
    if docker compose --env-file env.dev build; then
        echo -e "${GREEN}✅ 构建成功！${NC}"
        
        echo ""
        read -p "是否启动服务进行测试？(y/N): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}🚀 启动服务...${NC}"
            docker compose --env-file env.dev up -d
            
            echo -e "${BLUE}⏳ 等待服务启动...${NC}"
            sleep 10
            
            echo -e "${BLUE}📊 检查服务状态...${NC}"
            docker compose ps
            
            echo ""
            echo -e "${GREEN}✅ 服务已启动！${NC}"
            echo "访问地址："
            echo "• 前端: http://localhost:3000"
            echo "• 管理系统: http://localhost:3001"
            echo "• 后端API: http://localhost:3002"
            echo "• Nginx代理: http://localhost"
            
            echo ""
            read -p "测试完成后是否停止服务？(Y/n): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                docker compose down
                echo -e "${GREEN}✅ 服务已停止${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ 构建失败！${NC}"
        exit 1
    fi
fi

echo -e "\n${GREEN}🎉 检查完成！${NC}"
