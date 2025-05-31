#!/bin/bash
# PostgreSQL開発環境用エントリーポイントスクリプト
# 公式のdocker-entrypoint.shを拡張してカスタム初期化処理を追加

set -Eeo pipefail

# ログ関数の定義
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

log "Starting PostgreSQL custom initialization..."

# 環境変数の設定とバリデーション
if [ -z "$POSTGRES_DB" ]; then
    error "POSTGRES_DB environment variable is required"
    exit 1
fi

if [ -z "$POSTGRES_USER" ]; then
    error "POSTGRES_USER environment variable is required"
    exit 1
fi

# カスタム初期化処理（データベースが初回作成時のみ実行）
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    log "First time setup detected, running custom initialization..."
    
    # ログディレクトリの作成
    mkdir -p /var/log/postgresql
    chown postgres:postgres /var/log/postgresql
    
    # バックアップディレクトリの作成
    mkdir -p /var/lib/postgresql/backups
    chown postgres:postgres /var/lib/postgresql/backups
    
    log "Custom directories created successfully"
fi

# 日本語ロケールの設定確認
log "Checking Japanese locale support..."
if ! locale -a | grep -q "ja_JP.UTF-8"; then
    log "Warning: ja_JP.UTF-8 locale not found, using C.UTF-8"
    export LC_ALL=C.UTF-8
    export LANG=C.UTF-8
else
    log "Japanese locale support confirmed"
fi

# 公式のPostgreSQLエントリーポイントスクリプトを実行
log "Executing official PostgreSQL entrypoint..."
exec docker-entrypoint.sh "$@"
