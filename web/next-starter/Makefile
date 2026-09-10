# Makefile — chạy toàn bộ FE bằng Docker, không cần cài Node/pnpm trên máy.
#
#   make dev     -> dev server + hot reload  (http://localhost:3000)
#   make up      -> bản production đã build  (http://localhost:3000)
#   make help    -> xem tất cả lệnh
#
# Yêu cầu duy nhất: Docker Desktop đang chạy.
# Windows: dùng Git Bash / WSL, hoặc `choco install make`.

SHELL := /bin/bash
COMPOSE := docker compose
DEV_SVC := dev
WEB_SVC := web
PORT ?= 3000

.DEFAULT_GOAL := help
.PHONY: help env dev dev-build up build down restart logs logs-dev ps sh sh-dev \
        install lint typecheck test check clean nuke health

## ---------------------------------------------------------------- meta

help: ## Danh sách lệnh
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

env: ## Tạo .env.local từ .env.example nếu chưa có
	@test -f .env.local || (cp .env.example .env.local && echo "Đã tạo .env.local")

## ---------------------------------------------------------------- dev

dev: env ## Chạy dev server kèm hot reload (Ctrl+C để dừng)
	$(COMPOSE) up $(DEV_SVC)

dev-build: env ## Build lại image dev (khi package.json đổi)
	$(COMPOSE) build --no-cache $(DEV_SVC)

## ---------------------------------------------------------------- production

build: env ## Build image production
	$(COMPOSE) build $(WEB_SVC)

up: env ## Build + chạy production nền, cổng 3000
	$(COMPOSE) up -d --build $(WEB_SVC)
	@echo "FE đang chạy tại http://localhost:$(PORT)"

## ---------------------------------------------------------------- vận hành

down: ## Dừng và xoá container
	$(COMPOSE) down

restart: down up ## Dựng lại production

ps: ## Trạng thái container
	$(COMPOSE) ps

logs: ## Xem log production
	$(COMPOSE) logs -f $(WEB_SVC)

logs-dev: ## Xem log dev
	$(COMPOSE) logs -f $(DEV_SVC)

sh: ## Shell vào container production
	$(COMPOSE) exec $(WEB_SVC) sh

sh-dev: ## Shell vào container dev
	$(COMPOSE) exec $(DEV_SVC) sh

health: ## Kiểm tra /api/health
	@curl -fsS http://localhost:$(PORT)/api/health && echo "" || echo "Chưa phản hồi"

## ---------------------------------------------------------------- chất lượng code (chạy trong container dev)

install: ## Cài lại dependency trong image dev
	$(COMPOSE) run --rm $(DEV_SVC) pnpm install

lint: ## ESLint
	$(COMPOSE) run --rm $(DEV_SVC) pnpm lint

typecheck: ## tsc --noEmit
	$(COMPOSE) run --rm $(DEV_SVC) pnpm typecheck

test: ## Vitest
	$(COMPOSE) run --rm $(DEV_SVC) pnpm test

check: lint typecheck test ## Chạy cả 3

## ---------------------------------------------------------------- dọn dẹp

clean: ## Xoá container + volume của project
	$(COMPOSE) down -v --remove-orphans

nuke: clean ## clean + xoá image và build cache
	$(COMPOSE) down --rmi local
	docker builder prune -f
