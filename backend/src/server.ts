/**
 * Express.js サーバーのメインエントリーポイント
 * HTTPサーバーの初期化と起動を行います
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiV1Router from './api/v1/index.js';

// 環境変数の設定
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Expressアプリケーションを作成
const app = express();

// ミドルウェアの設定
app.use(helmet({
  // 開発環境では一部のセキュリティ機能を緩和
  contentSecurityPolicy: NODE_ENV === 'development' ? false : undefined,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ヘルスチェックエンドポイント
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: '1.0.0'
    }
  });
});

app.use('/api/v1', apiV1Router);

// ルートエンドポイント
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'AI Search Assistant API',
      version: '1.0.0',
      endpoints: [
        'GET /api/v1/health - ヘルスチェック',
        'POST /api/v1/auth/register - ユーザー登録',
        'POST /api/v1/auth/login - ログイン',
        'GET /api/v1/auth/profile - ユーザープロフィール取得',
        'POST /api/v1/auth/logout - ログアウト',
        'POST /api/v1/search - AI検索（今後実装予定）'
      ]
    }
  });
});

// 404ハンドラー
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `エンドポイント ${req.originalUrl} が見つかりません`,
    }
  });
});

// エラーハンドラー
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '内部サーバーエラーが発生しました',
      ...(NODE_ENV === 'development' && { details: err.message })
    }
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
});

// グレースフルシャットダウンの処理
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
