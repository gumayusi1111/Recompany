up-dev:
	docker-compose --env-file .env.dev up --build

up-prod:
	docker-compose --env-file .env.prod up --build -d

down:
	docker-compose down