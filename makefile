up-dev:
	docker compose --env-file env.dev up --build

up-prod:
	docker compose --env-file env.prod up --build -d

down:
	docker compose down

# 仅启动数据库（用于开发时的数据库操作）
db-only:
	docker compose --env-file env.dev up -d db

# 查看日志
logs:
	docker compose logs -f

# 重启服务
restart:
	docker compose restart