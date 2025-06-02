/**
 * Express.js アプリケーションのメイン設定
 * 認証機能を含む全てのミドルウェアとルートを設定
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ルートのインポート
import authRoutes from "./api/v1/auth/auth.routes.js";
// 将来追加予定の他のルート
// import searchRoutes from './api/v1/search/search.routes.js';
// import chatRoutes from './api/v1/chat/chat.routes.js';

// 環境変数の設定
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Expressアプリケーションのインスタンス作成
const app = express();

// セキュリティミドルウェアの設定
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === "development" ? false : undefined,
    crossOriginEmbedderPolicy: false, // 開発環境での問題を回避
  }),
);

// CORS設定（クロスオリジンリクエストの許可）
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Cookieの送信を許可
    optionsSuccessStatus: 200, // レガシーブラウザ対応
  }),
);

// レート制限の設定（DDoS攻撃対策）
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 15分間に最大100リクエスト
  message: {
    success: false,
    error: "リクエストが多すぎます。しばらくしてから再度お試しください",
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, // `RateLimit-*` ヘッダーを返す
  legacyHeaders: false, // `X-RateLimit-*` ヘッダーを無効化
});

// 認証関連のエンドポイントにより厳しいレート制限
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 10, // 15分間に最大10回のログイン試行
  message: {
    success: false,
    error: "ログイン試行回数が上限に達しました。15分後に再度お試しください",
    timestamp: new Date().toISOString(),
  },
});

// 基本ミドルウェアの設定
app.use(
  express.json({
    limit: "10mb", // JSONボディのサイズ制限
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// リクエストログ（開発環境のみ）
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// レート制限の適用
app.use("/api/", limiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);

// APIルートの設定
app.use("/api/v1/auth", authRoutes);

// 将来追加予定のルート
// app.use('/api/v1/search', searchRoutes);
// app.use('/api/v1/chat', chatRoutes);

// ヘルスチェックエンドポイント（ホットリロードテスト用メッセージ追加）
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: "1.0.0",
      uptime: process.uptime(),
      message: "🔥 ホットリロード機能が正常に動作しています！",
    },
  });
});

// APIルートの一覧表示（開発用）
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "AI Search Assistant API",
      version: "1.0.0",
      environment: NODE_ENV,
      endpoints: [
        "GET /api/v1/health - ヘルスチェック",
        "POST /api/v1/auth/register - ユーザー登録",
        "POST /api/v1/auth/login - ユーザーログイン",
        "GET /api/v1/auth/profile - ユーザー情報取得",
        "POST /api/v1/auth/logout - ユーザーログアウト",
      ],
    },
    timestamp: new Date().toISOString(),
  });
});

// 404エラーハンドラー
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `エンドポイント ${req.method} ${req.originalUrl} が見つかりません`,
    message: "APIエンドポイントを確認してください",
    timestamp: new Date().toISOString(),
  });
});

// グローバルエラーハンドラー
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled Error:", err);

    // 開発環境では詳細なエラー情報を表示
    const errorResponse = {
      success: false,
      error: "内部サーバーエラーが発生しました",
      timestamp: new Date().toISOString(),
      ...(NODE_ENV === "development" && {
        details: err.message,
        stack: err.stack,
      }),
    };

    res.status(500).json(errorResponse);
  },
);

export default app;
