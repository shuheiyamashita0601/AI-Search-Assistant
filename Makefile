# シンプルなDocker環境用Makefile
# 共有イメージを使用しない構成

.PHONY: help build up down restart logs clean

# すべてのイメージをビルド
build:
	@echo "🏗️  すべてのイメージをビルド中..."
	docker-compose build
	@echo "✅ ビルドが完了しました"
	docker images | grep test-ai-search

# キャッシュを無視してビルド
build-force:
	@echo "🏗️  キャッシュを無視してすべてのイメージをビルド中..."
	docker-compose build --no-cache
	@echo "✅ 強制ビルドが完了しました"

# package-lock.json生成（初回セットアップ用）
init-lock-files:
	@echo "📦 すべてのパッケージでpackage-lock.jsonを生成中..."
	@echo "1. バックエンド..."
	cd backend && npm install
	@echo "2. フロントエンド..."
	cd frontend && npm install
	@echo "3. 型定義パッケージ..."
	cd packages/types && npm install
	@echo "✅ すべてのpackage-lock.jsonが生成されました"

# 開発環境を起動（シンプル版）
up:
	@echo "🚀 開発環境を起動中..."
	docker-compose up -d
	@echo "✅ 開発環境が起動しました"
	@echo ""
	@echo "🌐 アクセス情報:"
	@echo "  メインアプリ: http://localhost"
	@echo "  フロントエンド直接: http://localhost:3000"
	@echo "  バックエンドAPI直接: http://localhost:3001"
	@echo "  Prisma Studio: make db-studio"

# 段階的起動（トラブルシューティング用）
up-staged:
	@echo "🚀 段階的に開発環境を起動中..."
	@echo "📊 データベースサービスを起動中..."
	docker-compose up -d postgres redis
	@echo "⏳ データベース起動待ち（30秒）..."
	sleep 30
	@echo "🏗️  型定義サービスを起動中..."
	docker-compose up -d types
	@echo "⏳ 型定義コンパイル待ち（10秒）..."
	sleep 10
	@echo "🚀 アプリケーションサービスを起動中..."
	docker-compose up -d backend frontend
	@echo "⏳ アプリケーション起動待ち（20秒）..."
	sleep 20

	@echo "🌐 Nginxリバースプロキシを起動中..."
	docker-compose up -d nginx

	@echo "✅ 段階的起動が完了しました"
	@echo ""
	@echo "🌐 アクセス情報:"
	@echo "  メインアプリ: http://localhost"
	@echo "  フロントエンド直接: http://localhost:3000"
	@echo "  バックエンドAPI直接: http://localhost:3001"

# 開発環境を停止
down:
	@echo "🛑 開発環境を停止中..."
	docker-compose down
	@echo "✅ 開発環境を停止しました"

# 開発環境を再起動
restart: down up

# サービス状態を確認
status:
	@echo "📊 サービス状態:"
	docker-compose ps
	@echo ""
	@echo "🏥 ヘルスチェック状態:"
	docker-compose ps --filter "health=healthy"

# 全サービスのログを表示
logs:
	docker-compose logs --tail=50

# ログをリアルタイム監視
logs-follow:
	docker-compose logs -f

# 個別サービスのログ
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-postgres:
	docker-compose logs -f postgres

logs-nginx:
	docker-compose logs -f nginx

# コンテナシェル接続
shell-backend:
	docker-compose exec backend /bin/sh

shell-frontend:
	docker-compose exec frontend /bin/sh

shell-postgres:
	docker-compose exec postgres psql -U postgres -d test_ai_search_assistant

# データベース操作
db-migrate:
	@echo "🗃️  データベースマイグレーション実行中..."
	docker-compose exec backend npm run db:migrate

db-seed:
	@echo "🌱 シードデータ投入中..."
	docker-compose exec backend npm run db:seed

db-studio:
	@echo "🎨 Prisma Studioを起動中..."
	docker-compose exec -d backend npm run db:studio
	@echo "✅ Prisma Studio: http://localhost:5555"

db-reset:
	@echo "⚠️  データベースをリセット中..."
	docker-compose exec backend npm run db:reset

# メンテナンス
clean:
	@echo "🧹 コンテナとボリュームを削除中..."
	docker-compose down -v --remove-orphans

clean-images:
	@echo "🧹 未使用イメージを削除中..."
	docker image prune -f

clean-all: clean clean-images
	@echo "🧹 完全クリーンアップ中..."
	docker system prune -a -f --volumes

# 本番環境用
build-prod:
	@echo "🏭 本番環境用イメージをビルド中..."
	docker-compose -f docker-compose.prod.yml build

deploy-prod:
	@echo "🚀 本番環境をデプロイ中..."
	docker-compose -f docker-compose.prod.yml up -d

# 開発用ショートカット
quick-start: up db-migrate db-seed
	@echo "🎉 クイックスタートが完了しました！"

# バックアップ
backup-db:
	@echo "💾 データベースバックアップ中..."
	docker-compose exec postgres pg_dump -U postgres test_ai_search_assistant > backup_$(shell date +%Y%m%d_%H%M%S).sql

# 設定の検証
validate:
	@echo "✅ Docker Compose設定の構文チェック..."
	docker-compose config > /dev/null && echo "✅ 構文は正常です" || echo "❌ 構文エラーがあります"
