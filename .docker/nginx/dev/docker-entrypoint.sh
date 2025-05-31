#!/bin/sh
# Nginx開発環境用エントリーポイントスクリプト
# 起動前の設定チェックと初期化処理

set -e

# ログ関数の定義
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# 環境変数の設定
export NGINX_USER=${NGINX_USER:-nginx}
export NGINX_WORKER_PROCESSES=${NGINX_WORKER_PROCESSES:-1}
export BACKEND_HOST=${BACKEND_HOST:-backend}
export BACKEND_PORT=${BACKEND_PORT:-3001}
export FRONTEND_HOST=${FRONTEND_HOST:-frontend}
export FRONTEND_PORT=${FRONTEND_PORT:-3000}

log "Starting Nginx development environment..."

# 必要なディレクトリの作成と権限設定
log "Creating necessary directories..."
mkdir -p /var/log/nginx \
         /var/cache/nginx \
         /var/run/nginx \
         /tmp/nginx

# バックエンドサーバーの接続確認
log "Checking backend server connectivity..."
if ! nc -z $BACKEND_HOST $BACKEND_PORT; then
    error "Backend server ($BACKEND_HOST:$BACKEND_PORT) is not accessible"
    # 開発環境では警告のみ出して続行
    log "Warning: Backend server is not ready, but continuing anyway..."
fi

# フロントエンドサーバーの接続確認
log "Checking frontend server connectivity..."
if ! nc -z $FRONTEND_HOST $FRONTEND_PORT; then
    error "Frontend server ($FRONTEND_HOST:$FRONTEND_PORT) is not accessible"
    # 開発環境では警告のみ出して続行
    log "Warning: Frontend server is not ready, but continuing anyway..."
fi

# SSL証明書の確認（開発環境用）
log "Checking SSL certificates..."
if [ ! -f /etc/nginx/ssl/nginx-selfsigned.crt ] || [ ! -f /etc/nginx/ssl/nginx-selfsigned.key ]; then
    log "SSL certificates not found, generating self-signed certificates..."
    mkdir -p /etc/nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/nginx-selfsigned.key \
        -out /etc/nginx/ssl/nginx-selfsigned.crt \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=AI-Search-Assistant/OU=Development/CN=localhost"
    log "Self-signed SSL certificates generated successfully"
fi

# Nginx設定ファイルの構文チェック
log "Testing Nginx configuration..."
if ! nginx -t; then
    error "Nginx configuration test failed"
    exit 1
fi

log "Nginx configuration test passed"

# 設定ファイルのデバッグ情報出力（開発環境用）
if [ "${DEBUG:-false}" = "true" ]; then
    log "Debug mode enabled, showing configuration..."
    nginx -T
fi

# プロセスIDファイルの削除（前回の実行の残り）
if [ -f /var/run/nginx/nginx.pid ]; then
    log "Removing existing PID file..."
    rm -f /var/run/nginx/nginx.pid
fi

log "Starting Nginx..."

# 渡された引数をそのまま実行
exec "$@"
