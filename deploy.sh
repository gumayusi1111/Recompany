#!/bin/bash

# 生产环境部署脚本
# 用途：安全部署到不同环境，确保卷命名一致性

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印彩色消息
print_message() {
    echo -e "${2}${1}${NC}"
}

# 函数：检查环境参数
check_environment() {
    if [ -z "$1" ]; then
        print_message "错误：请指定环境 (development|staging|production)" $RED
        echo "用法: $0 <environment>"
        echo "示例: $0 production"
        exit 1
    fi

    if [[ ! "$1" =~ ^(development|staging|production)$ ]]; then
        print_message "错误：无效的环境 '$1'" $RED
        print_message "支持的环境: development, staging, production" $YELLOW
        exit 1
    fi
}

# 函数：创建外部卷
create_external_volumes() {
    local env=$1
    local project_name="company_re_${env}"
    
    print_message "📦 创建外部卷..." $BLUE
    
    volumes=(
        "${project_name}_postgres_data"
        "${project_name}_frontend_node_modules"
        "${project_name}_backend_node_modules"
        "${project_name}_management_node_modules"
    )
    
    for volume in "${volumes[@]}"; do
        if ! docker volume inspect "$volume" >/dev/null 2>&1; then
            print_message "创建卷: $volume" $GREEN
            docker volume create "$volume"
        else
            print_message "卷已存在: $volume" $YELLOW
        fi
    done
}

# 函数：部署应用
deploy_application() {
    local env=$1
    
    print_message "🚀 部署到 $env 环境..." $BLUE
    
    # 设置环境变量文件
    export ENV_FILE=".env.${env}"
    
    if [ ! -f "$ENV_FILE" ]; then
        print_message "错误：环境文件 $ENV_FILE 不存在" $RED
        exit 1
    fi
    
    print_message "使用环境文件: $ENV_FILE" $GREEN
    
    # 根据环境选择compose文件
    if [ "$env" = "production" ]; then
        COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
    else
        COMPOSE_FILES="-f docker-compose.yml"
    fi
    
    # 停止现有服务
    print_message "⏹️  停止现有服务..." $YELLOW
    docker compose --env-file "$ENV_FILE" $COMPOSE_FILES down
    
    # 构建镜像
    print_message "🔨 构建镜像..." $BLUE
    docker compose --env-file "$ENV_FILE" $COMPOSE_FILES build
    
    # 启动服务
    print_message "▶️  启动服务..." $GREEN
    docker compose --env-file "$ENV_FILE" $COMPOSE_FILES up -d
    
    # 等待服务启动
    print_message "⏳ 等待服务启动..." $YELLOW
    sleep 10
    
    # 检查服务状态
    print_message "📊 检查服务状态..." $BLUE
    docker compose --env-file "$ENV_FILE" $COMPOSE_FILES ps
}

# 函数：验证部署
verify_deployment() {
    local env=$1
    local project_name="company_re_${env}"
    
    print_message "✅ 验证部署..." $BLUE
    
    # 检查卷
    print_message "检查卷:" $GREEN
    docker volume ls | grep "$project_name" || true
    
    # 检查容器健康状态
    print_message "检查容器健康状态:" $GREEN
    docker compose --env-file ".env.${env}" ps --format "table {{.Name}}\t{{.Status}}"
}

# 主函数
main() {
    local environment=$1
    
    print_message "🌍 Company RE 部署脚本" $BLUE
    print_message "================================" $BLUE
    
    check_environment "$environment"
    
    print_message "部署环境: $environment" $GREEN
    print_message "项目名称: company_re_${environment}" $GREEN
    
    # 确认部署
    read -p "确认部署到 $environment 环境？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message "❌ 部署已取消" $RED
        exit 1
    fi
    
    # 执行部署步骤
    if [ "$environment" = "production" ]; then
        create_external_volumes "prod"
    else
        create_external_volumes "$environment"
    fi
    
    deploy_application "$environment"
    verify_deployment "$environment"
    
    print_message "🎉 部署完成！" $GREEN
    print_message "环境: $environment" $GREEN
    print_message "访问地址请查看相应的环境配置" $YELLOW
}

# 执行主函数
main "$@"
