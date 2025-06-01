#!/bin/bash

# API認証テストスクリプト
API_BASE="http://localhost:3001/api/v1"

echo "=== AI検索アシスタント認証APIテスト ==="
echo ""

# 1. ヘルスチェック
echo "1. ヘルスチェック"
curl -s -X GET "${API_BASE}/health" | jq .
echo ""

# 2. ユーザー登録
echo "2. ユーザー登録"
REGISTER_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "テストユーザー"
  }')
echo $REGISTER_RESPONSE | jq .

# アクセストークンを抽出
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.tokens.accessToken // empty')
echo "取得したアクセストークン: $ACCESS_TOKEN"
echo ""

# 3. ログイン
echo "3. ログイン"
LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }')
echo $LOGIN_RESPONSE | jq .

# ログインから新しいトークンを取得
if [ -z "$ACCESS_TOKEN" ]; then
  ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.tokens.accessToken // empty')
  echo "ログインで取得したアクセストークン: $ACCESS_TOKEN"
fi
echo ""

# 4. プロフィール取得（認証必須）
if [ ! -z "$ACCESS_TOKEN" ]; then
  echo "4. プロフィール取得（認証あり）"
  curl -s -X GET "${API_BASE}/auth/profile" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
  echo ""
else
  echo "4. エラー: アクセストークンが取得できませんでした"
  echo ""
fi

# 5. 無効なトークンでのアクセステスト
echo "5. 無効なトークンでのアクセステスト"
curl -s -X GET "${API_BASE}/auth/profile" \
  -H "Authorization: Bearer invalid-token" | jq .
echo ""

# 6. ログアウト
if [ ! -z "$ACCESS_TOKEN" ]; then
  echo "6. ログアウト"
  curl -s -X POST "${API_BASE}/auth/logout" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
  echo ""
else
  echo "6. スキップ: アクセストークンがありません"
  echo ""
fi

echo "=== テスト完了 ==="
