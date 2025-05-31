-- PostgreSQL初期化スクリプト
-- データベース作成と基本設定

-- 日本語照合順序の作成
CREATE COLLATION IF NOT EXISTS japanese (
    locale = 'ja_JP.UTF-8'
);

-- 全文検索用の設定（日本語対応）
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 地理空間データ用の拡張（将来の位置情報検索用）
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- UUID生成用の拡張
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 暗号化関数用の拡張
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 時系列データ用の拡張（将来のログ分析用）
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

-- データベースの基本設定
ALTER DATABASE test_ai_search_assistant SET timezone TO 'Asia/Tokyo';
ALTER DATABASE test_ai_search_assistant SET datestyle TO 'ISO, MDY';
ALTER DATABASE test_ai_search_assistant SET default_text_search_config TO 'pg_catalog.english';

-- 開発用ユーザーの作成（Prismaで管理されるため基本的には不要）
-- CREATE USER dev_user WITH PASSWORD 'dev_password';
-- GRANT CONNECT ON DATABASE test_ai_search_assistant TO dev_user;

-- 基本的なセキュリティ設定
-- ROLEの作成と権限設定はPrismaのマイグレーションで管理

-- 初期化完了のログ
SELECT 'Database initialization completed at ' || now() AS status;
