-- 数据库初始化脚本
-- 创建数据库（如果不存在）
SELECT 'CREATE DATABASE company_re'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'company_re')\gexec

-- 设置时区
SET timezone = 'Asia/Shanghai';

-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
