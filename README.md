## ディレクトリ構成

```text
test-ai-search-assistant/
├── 🖥️ frontend/                  # Next.js フロントエンド
│   ├── .dockerignore            # Docker用除外ファイル設定
│   ├── Dockerfile.dev           # 開発環境用Dockerファイル
│   ├── package.json             # フロントエンド依存関係管理
│   ├── tsconfig.json            # TypeScript設定（フロントエンド用）
│   ├── postcss.config.*         # PostCSS設定ファイル
│   ├── next.config.*            # Next.js設定ファイル
│   ├── tailwind.config.*        # Tailwind CSS設定ファイル
│   │
│   ├── public/                  # 静的ファイル（画像、アイコン等）
│   │   ├── favicon.ico
│   │   └── images/
│   │
│   └── src/                     # Next.js フロントエンドのソースコードルート
│       ├── app/                 # Next.js App Router のコアディレクトリ
│       │   ├── layout.tsx       # ルートレイアウト（全ページ共通）
│       │   ├── page.tsx         # ルートページ（メインページ）
│       │   ├── globals.css      # グローバルCSS
│       │   ├── loading.tsx      # ルートセグメントのローディングUI
│       │   ├── error.tsx        # ルートセグメントのエラーUI
│       │   ├── global-error.tsx # ルートレイアウトのエラーUI
│       │   │
│       │   ├── (chat)/          # チャット機能関連のルートグループ
│       │   │   └── chat/
│       │   │       ├── page.tsx     # /chat ページコンポーネント
│       │   │       └── layout.tsx   # チャットセクション専用レイアウト
│       │   │
│       │   └── api/             # Next.js API Routes（必要に応じて）
│       │       └── auth/
│       │           └── route.ts # 認証関連API
│       │
│       ├── components/          # 再利用可能なReactコンポーネント
│       │   ├── ui/              # 汎用UIコンポーネント
│       │   │   ├── Button/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Button.module.css    # CSS Modules
│       │   │   │   └── Button.test.tsx      # コンポーネントテスト
│       │   │   ├── Input/
│       │   │   ├── Modal/
│       │   │   └── index.ts     # UIコンポーネントの統合エクスポート
│       │   │
│       │   ├── features/        # 機能固有のコンポーネント群
│       │   │   ├── chat/
│       │   │   │   ├── ChatInput.tsx
│       │   │   │   ├── MessageList.tsx
│       │   │   │   ├── ChatMessage.tsx
│       │   │   │   └── index.ts
│       │   │   ├── search/
│       │   │   │   ├── SearchForm.tsx
│       │   │   │   ├── SearchResults.tsx
│       │   │   │   └── index.ts
│       │   │   └── auth/
│       │   │       ├── LoginForm.tsx
│       │   │       └── index.ts
│       │   │
│       │   └── layout/          # レイアウトコンポーネント
│       │       ├── Header.tsx
│       │       ├── Footer.tsx
│       │       ├── Sidebar.tsx
│       │       └── Navigation.tsx
│       │
│       ├── hooks/               # カスタムReactフック
│       │   ├── useChat.ts       # チャット機能用フック
│       │   ├── useSearch.ts     # 検索機能用フック
│       │   ├── useAuth.ts       # 認証用フック
│       │   └── index.ts         # フックの統合エクスポート
│       │
│       ├── lib/                 # ライブラリコード・外部サービス連携
│       │   ├── apiClient.ts     # バックエンドAPI通信クライアント
│       │   ├── auth.ts          # 認証関連ヘルパー
│       │   ├── openai.ts        # OpenAI API連携
│       │   └── validators.ts    # フロントエンド用バリデーション
│       │
│       ├── utils/               # 汎用ユーティリティ関数
│       │   ├── formatters.ts    # データフォーマット関数
│       │   ├── constants.ts     # 定数定義
│       │   ├── helpers.ts       # 汎用ヘルパー関数
│       │   └── index.ts         # ユーティリティの統合エクスポート
│       │
│       ├── styles/              # スタイル関連ファイル
│       │   ├── globals.css      # グローバルスタイル
│       │   ├── variables.css    # CSS変数定義
│       │   └── themes/          # テーマ管理
│       │       ├── light.css    # ライトテーマ
│       │       └── dark.css     # ダークテーマ
│       │
│       ├── store/               # クライアントサイド状態管理
│       │   ├── chatStore.ts     # チャット状態管理（Zustand/Jotai）
│       │   ├── userStore.ts     # ユーザー状態管理
│       │   ├── searchStore.ts   # 検索状態管理
│       │   └── index.ts         # ストアの統合エクスポート
│       │
│       └── types/               # フロントエンド固有のTypeScript型定義
│           ├── index.ts         # フロントエンド型の統合エクスポート
│           ├── components.ts    # コンポーネント用型定義
│           └── api.ts           # API関連型定義
│
├── ⚙️ backend/                  # Express.js バックエンド API
│   ├── .dockerignore            # Docker用除外ファイル設定
│   ├── .env                     # 環境変数（開発用）
│   ├── .env.example             # 環境変数テンプレート
│   ├── Dockerfile.dev           # 開発環境用Dockerファイル
│   ├── package.json             # バックエンド依存関係管理
│   ├── tsconfig.json            # TypeScript設定（バックエンド用）
│   │
│   ├── prisma/                  # Prisma ORM設定
│   │   ├── schema.prisma        # データベーススキーマ定義
│   │   ├── migrations/          # データベースマイグレーション
│   │   │   └── [timestamp]_*/   # 各マイグレーションファイル
│   │   └── seed.ts              # ダミーデータ投入スクリプト
│   │
│   └── src/                     # バックエンドのソースコードルート
│       ├── app.ts               # Expressアプリケーション設定
│       ├── server.ts            # HTTPサーバー初期化・起動
│       │
│       ├── api/                 # APIエンドポイント（機能別）
│       │   ├── v1/              # APIバージョン管理
│       │   │   ├── index.ts     # v1 API統合ルーター
│       │   │   ├── auth/        # 認証関連API
│       │   │   │   ├── auth.routes.ts      # 認証エンドポイント定義
│       │   │   │   ├── auth.controller.ts  # 認証コントローラー
│       │   │   │   ├── auth.service.ts     # 認証ビジネスロジック
│       │   │   │   └── auth.validation.ts  # 認証リクエストバリデーション
│       │   │   ├── search/      # AI検索機能API
│       │   │   │   ├── search.routes.ts    # 検索エンドポイント定義
│       │   │   │   ├── search.controller.ts # 検索コントローラー
│       │   │   │   ├── search.service.ts   # AI検索ビジネスロジック
│       │   │   │   └── search.validation.ts # 検索リクエストバリデーション
│       │   │   ├── chat/        # チャット機能API
│       │   │   │   ├── chat.routes.ts      # チャットエンドポイント定義
│       │   │   │   ├── chat.controller.ts  # チャットコントローラー
│       │   │   │   ├── chat.service.ts     # チャットビジネスロジック
│       │   │   │   └── chat.validation.ts  # チャットリクエストバリデーション
│       │   │   └── health/      # ヘルスチェックAPI
│       │   │       └── health.routes.ts    # ヘルスチェックエンドポイント
│       │   └── index.ts         # API統合ルーター
│       │
│       ├── config/              # 設定・環境変数管理
│       │   ├── index.ts         # 設定統合エクスポート
│       │   ├── database.ts      # データベース接続設定
│       │   ├── openai.ts        # OpenAI API設定
│       │   └── redis.ts         # Redis設定（セッション管理用）
│       │
│       ├── lib/                 # ライブラリ・外部サービス連携
│       │   ├── prisma/          # Prisma関連
│       │   │   ├── client.ts    # Prisma Clientインスタンス
│       │   │   └── utils.ts     # Prisma用ユーティリティ
│       │   ├── openai/          # OpenAI連携
│       │   │   ├── client.ts    # OpenAI APIクライアント
│       │   │   ├── prompts.ts   # プロンプトテンプレート
│       │   │   └── utils.ts     # OpenAI用ユーティリティ
│       │   └── redis/           # Redis連携
│       │       ├── client.ts    # Redisクライアント
│       │       └── utils.ts     # Redis用ユーティリティ
│       │
│       ├── middleware/          # Expressミドルウェア
│       │   ├── index.ts         # ミドルウェア統合エクスポート
│       │   ├── auth.ts          # 認証ミドルウェア
│       │   ├── cors.ts          # CORS設定ミドルウェア
│       │   ├── errorHandler.ts  # グローバルエラーハンドリング
│       │   ├── rateLimiter.ts   # レート制限ミドルウェア
│       │   ├── requestLogger.ts # リクエストロギング
│       │   └── validation.ts    # バリデーションミドルウェア
│       │
│       ├── services/            # ビジネスロジック・外部サービス
│       │   ├── aiService.ts     # AI検索サービス
│       │   ├── authService.ts   # 認証サービス
│       │   ├── chatService.ts   # チャットサービス
│       │   ├── searchService.ts # 検索サービス
│       │   └── index.ts         # サービス統合エクスポート
│       │
│       └── utils/               # 汎用ユーティリティ関数
│           ├── index.ts         # ユーティリティ統合エクスポート
│           ├── apiResponse.ts   # API標準レスポンスフォーマッター
│           ├── keywordExtractor.ts # キーワード抽出ロジック
│           ├── logger.ts        # ログ出力ユーティリティ
│           ├── validation.ts    # バリデーション関数
│           └── crypto.ts        # 暗号化・ハッシュ化関数
│
├── 📦 packages/                 # モノリポ共有パッケージ
│   ├── tsconfig.json            # 共有TypeScript設定
│   └── types/                   # フロントエンド・バックエンド共有型定義
│       ├── .dockerignore        # Docker用除外ファイル設定
│       ├── Dockerfile.dev       # 型定義パッケージ用Dockerファイル
│       ├── package.json         # 型定義パッケージ依存関係
│       ├── tsconfig.json        # 型定義用TypeScript設定
│       └── src/                 # 共有型定義ソースコード
│           ├── index.ts         # 主要型定義の統合エクスポート
│           ├── api.ts           # API関連共有型定義
│           ├── auth.ts          # 認証関連共有型定義
│           ├── chat.ts          # チャット関連共有型定義
│           ├── search.ts        # 検索関連共有型定義
│           ├── user.ts          # ユーザー関連共有型定義
│           └── common.ts        # 汎用共有型定義
│
├── 🗃️ database/                 # データベース初期化・管理
│   └── init/                    # PostgreSQL初期化スクリプト
│       ├── 01_init_database.sql # データベース初期化SQL
│       ├── 02_create_extensions.sql # PostgreSQL拡張機能追加
│       └── 03_setup_permissions.sql # 権限設定SQL
│
├── 🐳 .docker/                  # Docker関連設定ファイル
│   ├── nginx/                   # Nginx Webサーバー設定
│   │   └── dev/                 # 開発環境用Nginx設定
│   │       ├── Dockerfile       # Nginx用Dockerファイル
│   │       ├── nginx.conf       # Nginx設定ファイル
│   │       └── conf.d/          # 追加設定ディレクトリ
│   │           └── default.conf # デフォルトサーバー設定
│   └── postgres/                # PostgreSQL設定
│       ├── Dockerfile           # PostgreSQL用Dockerファイル
│       ├── docker-entrypoint.sh # PostgreSQL起動スクリプト
│       ├── postgresql.conf      # PostgreSQL設定ファイル
│       ├── pg_hba.conf          # PostgreSQL認証設定
│       └── init-scripts/        # 初期化スクリプト
│
├── 🔧 types/                    # ルートレベル型定義（レガシー/互換性用）
│   └── tsconfig.json            # TypeScript設定
│
├── 📂 src/                      # ルートレベルソースコード（統合用）
│   └── index.ts                 # 統合エクスポートファイル
│
├── 🔄 .husky/                   # Git フック管理
│   └── _/                       # Husky内部設定
│       ├── .gitignore           # Huskyファイル除外設定
│       └── husky.sh             # Huskyスクリプト
│
├── 🐳 docker-compose.yaml       # 開発環境用Docker Compose設定
├── 🚢 docker-compose.prod.yml   # 本番環境用Docker Compose設定
├── 🔧 Makefile                  # 開発タスク自動化スクリプト
├── 📦 package.json              # ルートパッケージ設定（モノリポ管理）
├── 🔒 package-lock.json         # 依存関係ロックファイル
├── ⚙️ .env                      # 環境変数（開発用・Git除外）
├── ⚙️ .env.example              # 環境変数テンプレート
├── 🚫 .gitignore                # Git除外ファイル設定
├── 📚 README.md                 # プロジェクト説明ドキュメント
└── 🎯 .vscode/                  # VS Code エディタ設定
    ├── launch.json              # デバッグ設定
    ├── tasks.json               # タスク設定
    ├── settings.json            # エディタ設定
    └── extensions.json          # 推奨拡張機能
```


## 技術スタック
| カテゴリー         | 技術スタック        | 運用バージョン | 備考                                                                 |
|--------------------|---------------------|---------------------------|----------------------------------------------------------------------|
| **実行環境**        | Node.js             | `22.x LTS`       | プロジェクト開始時の最新LTS版を推奨。`nvm`等で管理。                    |
| **フロントエンド**      | Next.js             | `15.3.3x`       | 公式ドキュメントで最新版を確認。                                          |
|                    | React               | `19.1.0`       | 通常Next.jsにバンドルされているバージョン。                               |
| **バックエンド**      | Express.js          | `5.1.0`         | v5が安定版としてリリースされています。                                      |
| **データベース**     | PostgreSQL          | `17.5`          | データベースサーバーのバージョン。                                        |
|                    | Prisma (ORM)        | `6.8.2`        | Prisma ClientとCLIのバージョン。                                       |
| **言語**            | TypeScript          | `5.8.3`        | フロントエンド・バックエンド共通。                                        |
| **パッケージ管理**     | npm                | `11.4.1`     | バージョン管理に使用                             |
| **コンテナ技術**      | Docker Engine       | `28.2.1`        | 開発・本番環境のコンテナ実行エンジン。                                   |
|                    | Docker Compose      | `v2.36.2`       | 複数コンテナ定義・管理ツール。                                          |
| **Webサーバー**      | Nginx               | `1.28.0`        | リバースプロキシ、静的コンテンツ配信。                                     |
| **バージョン管理**    | Git                 | `2.49.0`        | ソースコードのバージョン管理。                                            |
| **コードフォーマッタ**  | Prettier            | `3.5.3`         | チームでのコードスタイル統一。                                          |
| **リンター**          | ESLint              | `9.27.0`        | コード品質維持、潜在的なバグ発見。                                        |
|                    | Stylelint           | `16.20.0`        | (CSS/SCSSを利用する場合) スタイルシートのリンター。                          |
