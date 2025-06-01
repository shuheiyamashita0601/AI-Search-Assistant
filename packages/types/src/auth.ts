/**
 * 認証関連の共有型定義
 * フロントエンドとバックエンドで共有する認証関連の型
 */

// ユーザー情報の基本型
export interface User {
  readonly id: number;
  readonly email: string;
  readonly name?: string;
  readonly isActive: boolean;
  readonly emailVerified: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastLoginAt?: string;
}

// ログイン認証情報
export interface LoginCredentials {
  readonly username: string; // ユーザー名を使用
  readonly password: string;
  readonly rememberMe?: boolean;
}

// 認証トークン情報
export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer';
}

// ユーザー登録情報
export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly name?: string;
}

// 認証成功レスポンス
export interface AuthResponse {
  readonly user: User;
  readonly tokens: AuthTokens;
}

// バリデーションエラー詳細
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly value?: any;
}

// バリデーションエラーレスポンス
export interface ValidationErrorResponse {
  readonly success: false;
  readonly error: 'VALIDATION_ERROR';
  readonly validationErrors: ValidationError[];
  readonly timestamp: string;
}
