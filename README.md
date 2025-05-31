## ディレクトリ構成
test-ai-search-assistant/
├── 🖥️ frontend/                  # Next.js フロントエンド
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── src/                     # Next.js フロントエンドのソースコードルート
│       ├── app/                 # Next.js App Router のコアディレクトリ
│       │   ├── layout.tsx       # ルートレイアウト (全ページ共通)
│       │   ├── page.tsx         # ルートページ (例: チャットインターフェースのメインページ)
│       │   ├── globals.css      # グローバルCSS
│       │   ├── loading.tsx      # ルートセグメントのローディングUI
│       │   ├── error.tsx        # ルートセグメントのエラーUI
│       │   ├── global-error.tsx # ルートレイアウトのエラーUI
│       │   │
│       │   ├── (chat)/          # (オプション) チャット機能関連のルートグループ
│       │   │   └── chat/
│       │   │       ├── page.tsx     # /chat ページのメインコンポーネント
│       │   │       └── layout.tsx   # (オプション) /chat セクション専用レイアウト
│       │   │
│       │   └── api/             # Next.js API Routes (フロントエンド内で完結するAPIが必要な場合)
│       │       └── (例: auth/route.ts)
│       │
│       ├── components/          # 再利用可能なReactコンポーネント
│       │   ├── ui/              # 汎用UIコンポーネント (Button, Input, Modal等)
│       │   │   └── Button/
│       │   │       ├── Button.tsx
│       │   │       ├── Button.module.css # CSS Modules
│       │   │       └── Button.test.tsx   # コンポーネントテスト
│       │   │   └── (他のUIコンポーネント...)
│       │   │
│       │   ├── features/        # 特定機能に関連するコンポーネント群
│       │   │   └── chat/
│       │   │       ├── ChatInput.tsx
│       │   │       ├── MessageList.tsx
│       │   │       └── ChatMessage.tsx
│       │   │   └── (他の機能コンポーネント...)
│       │   │
│       │   └── layout/          # 大きなレイアウトコンポーネント (Header, Footer等)
│       │       ├── Header.tsx
│       │       └── Footer.tsx
│       │
│       ├── hooks/               # カスタムReactフック (例: useChat.ts)
│       │   └── useChat.ts
│       │
│       ├── lib/                 # ライブラリコード、APIクライアント、外部サービス連携
│       │   ├── apiClient.ts     # バックエンドAPIとの通信クライアント
│       │   └── (例: auth.ts)    # 認証関連ヘルパー
│       │
│       ├── utils/               # 汎用ユーティリティ関数 (副作用なし)
│       │   ├── formatters.ts
│       │   └── validators.ts
│       │
│       ├── styles/              # グローバルスタイル、テーマ、CSS変数
│       │   ├── variables.css
│       │   └── themes/
│       │       ├── light.css
│       │       └── dark.css
│       │
│       ├── store/               # (オプション) クライアントサイド状態管理 (例: Zustand, Jotai)
│       │   ├── chatStore.ts
│       │   └── userStore.ts
│       │
│       └── types/               # フロントエンド固有のTypeScript型定義 (共有型は packages/types を使用)
│           └── index.ts
│
├── ⚙️ backend/                  # Express.js バックエンド
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── src/                     # バックエンドのソースコードルート
│       ├── app.ts               # Expressアプリケーション設定・ミドルウェア登録
│       ├── server.ts            # HTTPサーバー初期化・起動
│       │
│       ├── api/                 # APIモジュール (機能/ドメイン別)
│       │   └── property/        # 物件検索機能モジュール (例)
│       │       ├── property.routes.ts       # 物件関連APIエンドポイント定義
│       │       ├── property.controller.ts   # リクエスト処理、サービス呼び出し
│       │       ├── property.service.ts      # ビジネスロジック、キーワード抽出、データフィルタリング
│       │       └── property.validation.ts   # (オプション) リクエストバリデーションスキーマ (例: Zod)
│       │   └── (他の機能モジュール...)/
│       │
│       ├── config/              # 設定関連
│       │   └── index.ts         # 環境変数読み込み・管理など (例: dotenv設定)
│       │
│       ├── lib/                 # ライブラリ、外部サービス連携など
│       │   └── prisma/          # Prisma ORM関連
│       │       ├── schema.prisma    # Prismaスキーマ定義 (Propertyモデルなど)
│       │       ├── migrations/      # Prismaが生成するマイグレーションファイル
│       │       │   └──...
│       │       ├── seed.ts          # ダミーデータ投入用スクリプト
│       │       └── client.ts        # Prisma Clientインスタンスのエクスポート
│       │
│       ├── middleware/          # Expressカスタムミドルウェア
│       │   ├── errorHandler.ts  # グローバルエラーハンドリングミドルウェア
│       │   └── requestLogger.ts # (オプション) リクエストロギングミドルウェア
│       │
│       └── utils/               # 汎用ユーティリティ関数
│           ├── keywordExtractor.ts # キーワード抽出ロジック
│           └── apiResponse.ts    # (オプション) 標準化されたAPIレスポンスフォーマッター
│
├── 🗃️ database/
│   └── init/                  # PostgreSQL初期化スクリプト (Prismaマイグレーションとは別)
│
├── 🌐 nginx/
│   └── nginx.conf
│
├── 📦 packages/                 # モノリポ内の共有パッケージ (推奨)
│   └── types/                   # フロントエンドとバックエンドで共有するTypeScript型定義
│       ├── src/
│       │   ├── index.ts         # 共有型のメインエクスポートファイル
│       │   └── property.types.ts # 例: 物件情報やAPIレスポンスの型
│       └── package.json         # 共有パッケージのpackage.json
│
├── 🐳 docker-compose.yml
├── 🚢 docker-compose.prod.yml
├── 🔧 Makefile
├── 📄 setup.sh
├── 📚 DEVELOPMENT.md
├── ⚙️ .env.example
└── 🎯 .vscode/
    ├── launch.json
    └── tasks.json



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
