#!/bin/sh

# Prisma Studio自動起動スクリプト
# バックグラウンドでPrisma Studioを起動し、メインアプリと並行して動作させる

echo "🎨 Prisma Studio を起動中..."

# Prisma Studioをバックグラウンドで起動
npx prisma studio --hostname 0.0.0.0 --port 5556 --browser none &

# プロセスIDを保存
STUDIO_PID=$!

echo "✅ Prisma Studio が起動しました (PID: $STUDIO_PID)"
echo "🌐 アクセス先: http://localhost:5556"

# PIIDファイルに保存（後でkillするため）
echo $STUDIO_PID > /tmp/prisma-studio.pid

# メインプロセスの起動（npm run dev）
exec "$@"
