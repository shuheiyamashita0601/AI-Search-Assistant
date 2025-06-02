/**
 * API共通レスポンス型定義
 * すべてのAPIエンドポイントで一貫したレスポンス形式を保証します
 */

// 成功時のAPIレスポンス型
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

// エラー時のAPIレスポンス型
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string; // 開発環境でのみ含める
  };
  meta: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

// ページネーション情報
export interface Pagination {
  /** 現在のページ番号（1から開始） */
  page: number;
  /** 1ページあたりのアイテム数 */
  limit: number;
  /** 総アイテム数 */
  total: number;
  /** 総ページ数 */
  totalPages: number;
  /** 前のページが存在するか */
  hasPrevious: boolean;
  /** 次のページが存在するか */
  hasNext: boolean;
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// 検索クエリの基底型
export interface BaseSearchQuery {
  /** 検索キーワード */
  query?: string;
  /** ページ番号（1から開始） */
  page?: number;
  /** 1ページあたりのアイテム数（デフォルト20、最大100） */
  limit?: number;
  /** ソート順 */
  sortBy?: string;
  /** ソート方向 */
  sortOrder?: "asc" | "desc";
}

// HTTPステータスコード
export type HttpStatusCode =
  | 200
  | 201
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 500;

// APIエラーコード
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT_EXCEEDED"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";
