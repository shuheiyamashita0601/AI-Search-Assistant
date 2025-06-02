// 共通型定義のメインエクスポートファイル
// すべての型をここから再エクスポートして、インポートを簡潔にします

// API共通レスポンス型
export * from "./api.types.js";

// 基本的な型定義（最初はこれだけ）
export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
