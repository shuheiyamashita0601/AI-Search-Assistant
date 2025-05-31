/**
 * 共有型定義パッケージのメインエクスポートファイル
 * フロントエンドとバックエンドで共有するTypeScript型定義
 * 
 * @packageDocumentation
 */

// =============================================================================
// 基本的なAPIレスポンス型
// =============================================================================

/**
 * API成功レスポンスの基本型
 * すべてのAPI成功レスポンスで使用される共通構造
 */
export interface ApiSuccessResponse<T = unknown> {
  /** レスポンスの成功状態 */
  readonly success: true;
  /** レスポンスデータ（ジェネリック型で柔軟に対応） */
  readonly data: T;
  /** レスポンスメッセージ（オプション） */
  readonly message?: string;
  /** タイムスタンプ（ISO 8601形式） */
  readonly timestamp: string;
  /** リクエストID（トレーシング用） */
  readonly requestId?: string;
}

/**
 * APIエラーレスポンスの基本型
 * すべてのAPIエラーレスポンスで使用される共通構造
 */
export interface ApiErrorResponse {
  /** レスポンスの失敗状態 */
  readonly success: false;
  /** エラーメッセージ */
  readonly error: string;
  /** エラーコード（アプリケーション固有） */
  readonly errorCode?: string;
  /** 詳細なエラー情報（開発環境用） */
  readonly details?: Record<string, unknown>;
  /** タイムスタンプ（ISO 8601形式） */
  readonly timestamp: string;
  /** リクエストID（トレーシング用） */
  readonly requestId?: string;
}

/**
 * API レスポンスの統合型
 * 成功またはエラーのどちらかの状態を表現
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// =============================================================================
// ページネーション関連型
// =============================================================================

/**
 * ページネーション用のリクエストパラメータ
 * 一覧取得APIで使用される共通パラメータ
 */
export interface PaginationParams {
  /** ページ番号（1から開始） */
  readonly page?: number;
  /** 1ページあたりのアイテム数 */
  readonly limit?: number;
  /** ソート対象のフィールド */
  readonly sortBy?: string;
  /** ソート順序（昇順または降順） */
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * ページネーション情報
 * 一覧取得APIのレスポンスに含まれるメタデータ
 */
export interface PaginationInfo {
  /** 現在のページ番号 */
  readonly currentPage: number;
  /** 1ページあたりのアイテム数 */
  readonly itemsPerPage: number;
  /** 総アイテム数 */
  readonly totalItems: number;
  /** 総ページ数 */
  readonly totalPages: number;
  /** 前のページが存在するかどうか */
  readonly hasPreviousPage: boolean;
  /** 次のページが存在するかどうか */
  readonly hasNextPage: boolean;
}

/**
 * ページネーション付きレスポンス
 * 一覧取得APIで使用される共通レスポンス形式
 */
export interface PaginatedResponse<T> {
  /** アイテムの配列 */
  readonly items: readonly T[];
  /** ページネーション情報 */
  readonly pagination: PaginationInfo;
}

// =============================================================================
// AI検索関連の型定義
// =============================================================================

/**
 * 検索クエリの型
 * ユーザーからの検索リクエストを表現
 */
export interface SearchQuery {
  /** 検索クエリ文字列 */
  readonly query: string;
  /** 検索カテゴリ（オプション） */
  readonly category?: string;
  /** 検索フィルター（オプション） */
  readonly filters?: Record<string, unknown>;
  /** 検索結果の最大件数 */
  readonly maxResults?: number;
}

/**
 * 検索結果アイテムの基本型
 * 検索結果として返される個々のアイテム
 */
export interface SearchResultItem {
  /** アイテムの一意識別子 */
  readonly id: string;
  /** アイテムのタイトル */
  readonly title: string;
  /** アイテムの説明 */
  readonly description: string;
  /** 検索スコア（関連度） */
  readonly score: number;
  /** アイテムのURL（存在する場合） */
  readonly url?: string;
  /** アイテムのメタデータ */
  readonly metadata?: Record<string, unknown>;
}

/**
 * 検索結果レスポンス
 * AI検索APIのレスポンス形式
 */
export interface SearchResponse {
  /** 検索結果アイテムの配列 */
  readonly results: readonly SearchResultItem[];
  /** 総件数 */
  readonly totalCount: number;
  /** 検索実行時間（ミリ秒） */
  readonly executionTime: number;
  /** 使用された検索アルゴリズム */
  readonly algorithm?: string;
  /** 検索の信頼度スコア */
  readonly confidenceScore?: number;
}

// =============================================================================
// ユーザー関連型
// =============================================================================

/**
 * ユーザーの基本情報
 * 認証やセッション管理で使用
 */
export interface User {
  /** ユーザーID */
  readonly id: string;
  /** ユーザー名 */
  readonly username: string;
  /** メールアドレス */
  readonly email: string;
  /** 表示名 */
  readonly displayName?: string;
  /** アバター画像のURL */
  readonly avatarUrl?: string;
  /** アカウント作成日時 */
  readonly createdAt: string;
  /** 最終更新日時 */
  readonly updatedAt: string;
}

/**
 * ログイン資格情報
 * 認証リクエストで使用
 */
export interface LoginCredentials {
  /** ユーザー名またはメールアドレス */
  readonly username: string;
  /** パスワード */
  readonly password: string;
  /** ログイン状態を保持するかどうか */
  readonly rememberMe?: boolean;
}

/**
 * 認証トークン情報
 * 認証成功時のレスポンスで使用
 */
export interface AuthTokens {
  /** アクセストークン */
  readonly accessToken: string;
  /** リフレッシュトークン */
  readonly refreshToken: string;
  /** トークンの有効期限（秒） */
  readonly expiresIn: number;
  /** トークンの種類 */
  readonly tokenType: 'Bearer';
}

// =============================================================================
// エラー関連型
// =============================================================================

/**
 * バリデーションエラーの詳細
 * フォーム入力などのバリデーション失敗時に使用
 */
export interface ValidationError {
  /** エラーが発生したフィールド名 */
  readonly field: string;
  /** エラーメッセージ */
  readonly message: string;
  /** エラーコード */
  readonly code: string;
  /** エラーの値（デバッグ用） */
  readonly value?: unknown;
}

/**
 * バリデーションエラーレスポンス
 * 複数のバリデーションエラーをまとめて返す場合
 */
export interface ValidationErrorResponse extends Omit<ApiErrorResponse, 'error'> {
  /** バリデーションエラーである旨 */
  readonly error: 'VALIDATION_ERROR';
  /** 個別のバリデーションエラー一覧 */
  readonly validationErrors: readonly ValidationError[];
}

// =============================================================================
// 設定・環境関連型
// =============================================================================

/**
 * アプリケーション設定
 * 実行時設定やフィーチャーフラグなど
 */
export interface AppConfig {
  /** アプリケーション名 */
  readonly appName: string;
  /** アプリケーションバージョン */
  readonly version: string;
  /** 実行環境 */
  readonly environment: 'development' | 'staging' | 'production';
  /** デバッグモードの有効性 */
  readonly debugMode: boolean;
  /** フィーチャーフラグ */
  readonly features: Record<string, boolean>;
}

// =============================================================================
// 型ガード関数
// =============================================================================

/**
 * API成功レスポンスかどうかを判定する型ガード関数
 * 
 * @param response - 判定対象のAPIレスポンス
 * @returns 成功レスポンスの場合true
 * 
 * @example
 * ```typescript
 * if (isApiSuccessResponse(response)) {
 *   // この時点でresponseはApiSuccessResponse<T>型として扱われる
 *   console.log(response.data);
 * }
 * ```
 */
export function isApiSuccessResponse<T = unknown>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * APIエラーレスポンスかどうかを判定する型ガード関数
 * 
 * @param response - 判定対象のAPIレスポンス
 * @returns エラーレスポンスの場合true
 * 
 * @example
 * ```typescript
 * if (isApiErrorResponse(response)) {
 *   // この時点でresponseはApiErrorResponse型として扱われる
 *   console.error(response.error);
 * }
 * ```
 */
export function isApiErrorResponse<T = unknown>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * バリデーションエラーレスポンスかどうかを判定する型ガード関数
 * 
 * @param response - 判定対象のAPIレスポンス
 * @returns バリデーションエラーレスポンスの場合true
 * 
 * @example
 * ```typescript
 * if (isValidationErrorResponse(response)) {
 *   // この時点でresponseはValidationErrorResponse型として扱われる
 *   response.validationErrors.forEach(error => {
 *     console.error(`${error.field}: ${error.message}`);
 *   });
 * }
 * ```
 */
export function isValidationErrorResponse(
  response: ApiResponse<unknown>
): response is ValidationErrorResponse {
  return isApiErrorResponse(response) && response.error === 'VALIDATION_ERROR';
}

// =============================================================================
// ユーティリティ型
// =============================================================================

/**
 * 深い読み取り専用型
 * オブジェクトのすべてのプロパティを再帰的に読み取り専用にする
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 部分的な深い型
 * オブジェクトのすべてのプロパティを再帰的にオプショナルにする
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 非null・非undefined型
 * nullとundefinedを除外した型
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * ID型のエイリアス
 * データベースのIDフィールドに使用
 */
export type ID = string;

/**
 * ISO 8601形式の日時文字列型
 * APIで日時データをやり取りする際に使用
 */
export type ISODateString = string;

// =============================================================================
// 定数のエクスポート
// =============================================================================

/**
 * HTTPステータスコードの定数
 * APIレスポンスでよく使用されるステータスコード
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * APIエンドポイントのパス定数
 * フロントエンドとバックエンドで共有するAPIパス
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    PROFILE: '/api/v1/auth/profile',
  },
  SEARCH: {
    QUERY: '/api/v1/search',
    SUGGESTIONS: '/api/v1/search/suggestions',
    HISTORY: '/api/v1/search/history',
  },
  HEALTH: '/api/v1/health',
} as const;

/**
 * バリデーションメッセージの定数
 * 一貫したエラーメッセージを提供
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: '必須項目です',
  EMAIL_INVALID: '有効なメールアドレスを入力してください',
  PASSWORD_TOO_SHORT: 'パスワードは8文字以上で入力してください',
  PASSWORD_TOO_WEAK: 'パスワードは英数字と記号を含む必要があります',
  USERNAME_TOO_SHORT: 'ユーザー名は3文字以上で入力してください',
  QUERY_TOO_SHORT: '検索クエリは2文字以上で入力してください',
} as const;
