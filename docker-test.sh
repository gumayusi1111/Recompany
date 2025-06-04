#!/bin/bash

# Docker配置测试脚本
# 用于验证Docker配置的完整性和正确性

set -e

echo "🐳 开始Docker配置测试..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要文件
check_files() {
    log_info "检查Docker配置文件..."
    
    local files=(
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
    
    local missing_files=()
    
    for file in "${files[@]}"; do
        if [[ -f "$file" ]]; then
            log_success "✓ $file 存在"
        else
            log_error "✗ $file 缺失"
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "发现 ${#missing_files[@]} 个缺失文件"
        return 1
    fi
    
    log_success "所有必要文件都存在"
}

# 检查端口配置
check_ports() {
    log_info "检查端口配置..."

    # 检查docker-compose.yml中的端口配置
    if grep -q "\${FRONTEND_PORT:-3000}:3000\|3000:3000" docker-compose.yml; then
        log_success "✓ 前端端口配置正确 (3000)"
    else
        log_error "✗ 前端端口配置错误"
    fi

    if grep -q "\${MANAGEMENT_PORT:-3001}:3001\|3001:3001" docker-compose.yml; then
        log_success "✓ 管理系统端口配置正确 (3001)"
    else
        log_error "✗ 管理系统端口配置错误"
    fi

    if grep -q "\${BACKEND_PORT:-3002}:3002\|3002:3002" docker-compose.yml; then
        log_success "✓ 后端端口配置正确 (3002)"
    else
        log_error "✗ 后端端口配置错误"
    fi

    if grep -q "5432:5432" docker-compose.yml; then
        log_success "✓ 数据库端口配置正确 (5432)"
    else
        log_error "✗ 数据库端口配置错误"
    fi
}

# 检查环境变量
check_env_vars() {
    log_info "检查环境变量配置..."
    
    if grep -q "BACKEND_PORT=3002" .env; then
        log_success "✓ 后端端口环境变量正确"
    else
        log_warning "⚠ 后端端口环境变量可能不正确"
    fi
    
    if grep -q "MANAGEMENT_PORT=3001" .env; then
        log_success "✓ 管理系统端口环境变量正确"
    else
        log_warning "⚠ 管理系统端口环境变量可能不正确"
    fi
    
    if grep -q "DATABASE_URL.*db:5432" .env; then
        log_success "✓ 数据库连接配置正确"
    else
        log_error "✗ 数据库连接配置错误"
    fi
}

# 检查nginx配置
check_nginx_config() {
    log_info "检查Nginx配置..."
    
    if grep -q "management:3001" docker/nginx/conf.d/example.conf; then
        log_success "✓ Nginx管理系统代理配置正确"
    else
        log_error "✗ Nginx管理系统代理配置错误"
    fi
    
    if grep -q "backend:3002" docker/nginx/conf.d/example.conf; then
        log_success "✓ Nginx后端代理配置正确"
    else
        log_error "✗ Nginx后端代理配置错误"
    fi
    
    if grep -q "frontend:3000" docker/nginx/conf.d/example.conf; then
        log_success "✓ Nginx前端代理配置正确"
    else
        log_error "✗ Nginx前端代理配置错误"
    fi
}

# 构建测试
build_test() {
    log_info "开始构建测试..."
    
    # 检测docker compose命令
    local DOCKER_COMPOSE_CMD="docker-compose"
    if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    elif ! command -v docker-compose >/dev/null 2>&1; then
        log_error "✗ 未找到docker-compose或docker compose命令"
        return 1
    fi

    # 停止现有容器
    log_info "停止现有容器..."
    $DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true

    # 清理旧镜像
    log_info "清理旧镜像..."
    docker system prune -f 2>/dev/null || true

    # 构建所有服务
    log_info "构建所有服务..."
    if $DOCKER_COMPOSE_CMD --env-file env.dev build --no-cache; then
        log_success "✓ 所有服务构建成功"
    else
        log_error "✗ 服务构建失败"
        return 1
    fi

    # 启动服务
    log_info "启动服务..."
    if $DOCKER_COMPOSE_CMD --env-file env.dev up -d; then
        log_success "✓ 所有服务启动成功"
    else
        log_error "✗ 服务启动失败"
        return 1
    fi
    
    # 等待服务就绪
    log_info "等待服务就绪..."
    sleep 30
    
    # 检查服务状态
    check_services_health
}

# 检查服务健康状态
check_services_health() {
    log_info "检查服务健康状态..."

    # 检测docker compose命令
    local DOCKER_COMPOSE_CMD="docker-compose"
    if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    fi

    local services=("frontend" "management" "backend" "db" "nginx")

    for service in "${services[@]}"; do
        if $DOCKER_COMPOSE_CMD ps | grep -q "$service.*Up"; then
            log_success "✓ $service 服务运行正常"
        else
            log_error "✗ $service 服务运行异常"
            $DOCKER_COMPOSE_CMD logs "$service" | tail -10
        fi
    done
}

# 连接测试
connectivity_test() {
    log_info "进行连接测试..."
    
    # 测试前端
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        log_success "✓ 前端服务连接正常"
    else
        log_error "✗ 前端服务连接失败"
    fi
    
    # 测试管理系统
    if curl -f http://localhost:3001 >/dev/null 2>&1; then
        log_success "✓ 管理系统连接正常"
    else
        log_error "✗ 管理系统连接失败"
    fi
    
    # 测试后端API
    if curl -f http://localhost:3002/api/health >/dev/null 2>&1; then
        log_success "✓ 后端API连接正常"
    else
        log_warning "⚠ 后端API连接失败（可能需要实现健康检查端点）"
    fi
    
    # 测试Nginx代理
    if curl -f http://localhost:80 >/dev/null 2>&1; then
        log_success "✓ Nginx代理连接正常"
    else
        log_error "✗ Nginx代理连接失败"
    fi
}

# 清理函数
cleanup() {
    log_info "清理测试环境..."
    # 检测docker compose命令
    local DOCKER_COMPOSE_CMD="docker-compose"
    if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    fi
    $DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true
}

# 主函数
main() {
    echo "🚀 Docker配置完整性测试"
    echo "=========================="
    
    # 检查文件
    if ! check_files; then
        log_error "文件检查失败，退出测试"
        exit 1
    fi
    
    # 检查端口配置
    check_ports
    
    # 检查环境变量
    check_env_vars
    
    # 检查nginx配置
    check_nginx_config
    
    # 询问是否进行构建测试
    echo ""
    read -p "是否进行完整构建测试？(y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 构建测试
        if build_test; then
            # 连接测试
            connectivity_test
        fi
        
        # 清理
        read -p "是否清理测试环境？(Y/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            cleanup
        fi
    fi
    
    echo ""
    log_success "🎉 Docker配置测试完成！"
}

# 捕获退出信号
trap cleanup EXIT

# 运行主函数
main "$@"
